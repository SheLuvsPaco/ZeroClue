package com.zerochat.app

import android.annotation.SuppressLint
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.core.app.NotificationCompat
import androidx.core.app.NotificationManagerCompat
import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.content.ActivityNotFoundException
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import java.io.IOException

class MainActivity : ComponentActivity() {
    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        web = WebView(this)
        setContentView(web)

        WebView.setWebContentsDebuggingEnabled(true)

        val ws: WebSettings = web.settings
        ws.javaScriptEnabled = true
        ws.domStorageEnabled = true
        ws.allowFileAccess = true
        ws.allowContentAccess = true
        ws.allowFileAccessFromFileURLs = true
        ws.allowUniversalAccessFromFileURLs = true 
        ws.userAgentString = ws.userAgentString + " ZeroChat/Android"

        web.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                if (url.startsWith("http://") || url.startsWith("https://")) return false
                if (url.startsWith("zerochat://")) {
                    handleZerochatUri(Uri.parse(url))
                    return true
                }
                return try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                } catch (_: Exception) { true }
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                android.util.Log.d("ZeroChat-Console", "${consoleMessage?.message()}")
                return true
            }
        }
        
        web.setDownloadListener { url, userAgent, contentDisposition, mimeType, _ ->
            try {
                val request = android.app.DownloadManager.Request(Uri.parse(url)).apply {
                    setMimeType(mimeType ?: "application/vnd.android.package-archive")
                    val cookies = android.webkit.CookieManager.getInstance().getCookie(url)
                    if (!cookies.isNullOrEmpty()) addRequestHeader("Cookie", cookies)
                    addRequestHeader("User-Agent", userAgent)
                    setNotificationVisibility(android.app.DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED)
                    setDestinationInExternalPublicDir(android.os.Environment.DIRECTORY_DOWNLOADS, android.webkit.URLUtil.guessFileName(url, contentDisposition, mimeType))
                    setTitle("Downloading File...")
                }
                val downloadManager = getSystemService(Context.DOWNLOAD_SERVICE) as android.app.DownloadManager
                downloadManager.enqueue(request)
                android.widget.Toast.makeText(this@MainActivity, "Download started", android.widget.Toast.LENGTH_SHORT).show()
            } catch (e: Exception) {
                android.widget.Toast.makeText(this@MainActivity, "Download failed", android.widget.Toast.LENGTH_SHORT).show()
            }
        }
        
        web.addJavascriptInterface(ZeroChatBridge(), "ZeroChatBridge")
        web.loadUrl("file:///android_asset/www/index.html")

        intent?.data?.let { handleZerochatUri(it) }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        intent.data?.let { handleZerochatUri(it) }
    }

    private fun handleZerochatUri(uri: Uri) {
        val token = uri.getQueryParameter("token") ?: return
        val base = uri.getQueryParameter("base") ?: ""
        
        runOnUiThread {
            if (base.isNotEmpty()) SharedPrefsHelper.setBaseUrl(this, base)
            val jsCode = """
                (function() {
                    if (window.__zerochatProvision) {
                        window.__zerochatProvision(${escapeJs(token)});
                    } else {
                        localStorage.setItem('zerochat_pending_invite_token', ${escapeJs(token)});
                        ${if (base.isNotEmpty()) "localStorage.setItem('zerochat_pending_invite_base', ${escapeJs(base)});" else ""}
                    }
                })();
            """.trimIndent()
            web.evaluateJavascript(jsCode, null)
        }
    }

    private fun escapeJs(s: String): String {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\""
    }

    inner class ZeroChatBridge {
        
        // Stateless Client (No CookieJar)
        private val client = OkHttpClient.Builder().build()

        @JavascriptInterface
        fun ping(): String = "pong"

        @JavascriptInterface
        fun postMessage(cmd: String, argsJson: String, requestId: String) {
            Thread {
                val resultJson = try {
                    processCommand(cmd, argsJson)
                } catch (e: Exception) {
                    "{\"error\":\"${e.message?.replace("\"", "\\\"") ?: "Unknown error"}\"}"
                }
                runOnUiThread { sendJsResponse(requestId, resultJson) }
            }.start()
        }

        @JavascriptInterface
        fun invoke(cmd: String, argsJson: String): String {
            return try {
                processCommand(cmd, argsJson)
            } catch (e: Exception) {
                "{\"error\":\"${e.message?.replace("\"", "\\\"")}\"}"
            }
        }

        private fun sendJsResponse(requestId: String, resultJson: String) {
            val escapedResult = resultJson.replace("\\", "\\\\").replace("'", "\\'")
            val js = "if(window.onNativeResponse) window.onNativeResponse('$requestId', '$escapedResult');"
            web.evaluateJavascript(js, null)
        }

        private fun processCommand(cmd: String, argsJson: String): String {
            val args = if (argsJson.isNotEmpty()) org.json.JSONObject(argsJson) else org.json.JSONObject()
            val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)

            return when (cmd) {
                "set_base" -> {
                    val base = args.optString("base", "https://joya-pentadactyl-lin.ngrok-free.dev")
                    SharedPrefsHelper.setBaseUrl(this@MainActivity, base)
                    "\"ok\""
                }
                "signup" -> signup(args.optString("username"), args.optString("password"), baseUrl, args.optString("invite_token", null))
                "login" -> login(args.optString("username"), args.optString("password"), baseUrl)
                "provision_with_token" -> provisionWithToken(args.optString("token"), baseUrl)
                "load_creds" -> loadCreds()
                "get_me" -> getMe()
                "getToken" -> getToken()
                "friends_list" -> friendsList()
                "friend_request" -> friendRequest(args.optString("to_username"))
                "friend_respond" -> friendRespond(args.optString("from_username"), args.optBoolean("accept"))
                "create_invite" -> createInvite(args.optString("friend_hint", null), args.optInt("ttl_minutes", 60))
                "send_to_username_hpke" -> sendToUsernameHpke(args.optString("username"), args.optString("plaintext"))
                "pull_and_decrypt" -> pullAndDecrypt()
                "upload_identity_and_keypackage" -> uploadIdentityAndKeypackage()
                "notify" -> notify(args.optString("title"), args.optString("body"))
                "openLink" -> openLink(args.optString("url"))
                "pickFile" -> pickFile(args.optString("accept", null), args.optBoolean("multiple"))
                else -> "{\"error\":\"Unknown command: $cmd\"}"
            }
        }

        // --- ATOMIC AUTH METHODS ---

        private fun signup(u: String, p: String, base: String, t: String?): String {
            val json = org.json.JSONObject().put("username", u).put("password", p)
            if (t != null) json.put("invite_token", t)
            
            val req = okhttp3.Request.Builder().url("$base/api/signup")
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), json.toString())).build()
            
            val provToken = client.newCall(req).execute().use { resp ->
                val body = resp.body?.string() ?: ""
                if (!resp.isSuccessful) throw IOException("Signup Failed (${resp.code}): $body")
                org.json.JSONObject(body).getString("provision_token")
            }

            val (devId, devAuth) = provisionWithTokenInternal(provToken, base)
            
            // ✅ Throttle + Upload (Atomic)
            android.util.Log.d("ZeroChat", "Signup: Waiting 500ms for server...")
            Thread.sleep(500)
            uploadIdentityAndKeypackageInternal(devId, devAuth)
            
            return "{\"device_id\":\"$devId\"}"
        }

        private fun login(u: String, p: String, base: String): String {
            val req = okhttp3.Request.Builder().url("$base/api/login")
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), org.json.JSONObject().put("username", u).put("password", p).toString())).build()
            
            val provToken = client.newCall(req).execute().use { resp ->
                val body = resp.body?.string() ?: ""
                if (!resp.isSuccessful) throw IOException("Login Failed (${resp.code}): $body")
                org.json.JSONObject(body).getString("provision_token")
            }
            
            val (devId, devAuth) = provisionWithTokenInternal(provToken, base)

            // ✅ Throttle + Upload (Atomic)
            android.util.Log.d("ZeroChat", "Login: Waiting 500ms for server...")
            Thread.sleep(500)
            uploadIdentityAndKeypackageInternal(devId, devAuth)
            
            return "{\"device_id\":\"$devId\"}"
        }

        // ✅ NEW: Atomic Provisioning (Fixes Invite Links)
        private fun provisionWithToken(t: String, base: String): String {
            val (devId, devAuth) = provisionWithTokenInternal(t, base)
            
            // ✅ FIX: Wait + Upload Keys (Critical for Invite Links)
            android.util.Log.d("ZeroChat", "Provision: Waiting 500ms for server sync...")
            Thread.sleep(500)
            uploadIdentityAndKeypackageInternal(devId, devAuth)
            
            return "{\"device_id\":\"$devId\"}"
        }

        private fun provisionWithTokenInternal(token: String, base: String): Pair<String, String> {
            val req = okhttp3.Request.Builder().url("$base/api/provision/redeem")
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), 
                    org.json.JSONObject().put("token", token).put("platform", "android").put("push_token", org.json.JSONObject.NULL).toString())).build()
            
            val body = client.newCall(req).execute().use { resp ->
                 val b = resp.body?.string() ?: ""
                 if (!resp.isSuccessful) throw IOException("Redeem Failed (${resp.code}): $b")
                 b
            }
            
            android.util.Log.d("ZeroChat", "Redeem Response: $body")

            val json = org.json.JSONObject(body)
            val did = json.getString("device_id")
            val dauth = json.optString("device_auth", json.optString("device_token", ""))
            
            if (dauth.isEmpty()) throw IOException("Server returned empty device_auth")

            SharedPrefsHelper.saveCredentials(this@MainActivity, did, dauth)
            return Pair(did, dauth)
        }

        private fun uploadIdentityAndKeypackage(): String {
            // Manual call (should rarely be needed now, but kept for safety)
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: throw IOException("Not provisioned")
            uploadIdentityAndKeypackageInternal(did, dauth)
            return "\"ok\""
        }

        private fun uploadIdentityAndKeypackageInternal(did: String, dauth: String) {
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val idKey = SharedPrefsHelper.getOrGenerateIdentityKey(this@MainActivity)
            
            // ✅ FIX: Use NO_WRAP (Standard Alphabet, No Newlines)
            val idB64 = android.util.Base64.encodeToString(idKey, android.util.Base64.NO_WRAP)
            val kp = ByteArray(200).also { java.security.SecureRandom().nextBytes(it) }
            val kpB64 = android.util.Base64.encodeToString(kp, android.util.Base64.NO_WRAP)

            // ... (keep the rest of the retry loop code same as before) ...

            // --- SET IDENTITY ---
            var identitySuccess = false
            for (i in 1..3) {
                try {
                    val req = okhttp3.Request.Builder().url("$base/api/keys/set_identity")
                        // ✅ Clean Headers
                        .header("x-device-id", did)
                        .header("x-device-auth", dauth)
                        .post(okhttp3.RequestBody.create("application/json".toMediaType(), 
                            org.json.JSONObject().put("device_id", did).put("identity_key_b64", idB64).toString())).build()
                    
                    client.newCall(req).execute().use { 
                        if (it.isSuccessful) {
                            identitySuccess = true
                        } else if (it.code == 401) {
                            android.util.Log.w("ZeroChat", "Set Identity 401 (Attempt $i) - Retrying...")
                            Thread.sleep(1000)
                        } else {
                            throw IOException("Set Identity failed: ${it.code}")
                        }
                    }
                    if (identitySuccess) break
                } catch (e: Exception) {
                    if (i == 3) throw e
                    Thread.sleep(1000)
                }
            }
            if (!identitySuccess) throw IOException("Set Identity 401 (See logs)")

            // --- UPLOAD KEYPACKAGE ---
            var kpSuccess = false
            for (i in 1..3) {
                try {
                    val req = okhttp3.Request.Builder().url("$base/api/keys/upload_keypackage")
                        .header("x-device-id", did)
                        .header("x-device-auth", dauth)
                        .post(okhttp3.RequestBody.create("application/json".toMediaType(), 
                            org.json.JSONObject().put("keypackage_b64", kpB64).toString())).build()
                    
                    client.newCall(req).execute().use { 
                         if (it.isSuccessful) kpSuccess = true
                         else if (it.code == 401) Thread.sleep(1000)
                         else throw IOException("Upload KeyPackage failed: ${it.code}")
                    }
                    if (kpSuccess) break
                } catch (e: Exception) {
                     if (i == 3) throw e
                     Thread.sleep(1000)
                }
            }
        }

        // --- OTHER METHODS (Standard Headers) ---
        private fun friendsList(): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: throw IOException("Not provisioned")
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val req = okhttp3.Request.Builder().url("$base/api/friends/list")
                .header("x-device-id", did).header("x-device-auth", dauth).get().build()
            
            return client.newCall(req).execute().use { resp ->
                val body = resp.body?.string() ?: "[]"
                if (!resp.isSuccessful) throw IOException("Error ${resp.code}: $body")
                body
            }
        }

        private fun friendRequest(toUser: String): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: throw IOException("Not provisioned")
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val req = okhttp3.Request.Builder().url("$base/api/friends/request")
                .header("x-device-id", did).header("x-device-auth", dauth)
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), org.json.JSONObject().put("to_username", toUser).toString())).build()
            
            client.newCall(req).execute().use {
                if (!it.isSuccessful) throw IOException("Error: ${it.body?.string()}")
            }
            return "\"ok\""
        }

        private fun friendRespond(fromUser: String, accept: Boolean): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: throw IOException("Not provisioned")
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val req = okhttp3.Request.Builder().url("$base/api/friends/respond")
                .header("x-device-id", did).header("x-device-auth", dauth)
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), org.json.JSONObject().put("from_username", fromUser).put("accept", accept).toString())).build()
            
            client.newCall(req).execute().use {
                if (!it.isSuccessful) throw IOException("Error: ${it.body?.string()}")
            }
            return "\"ok\""
        }

        private fun sendToUsernameHpke(u: String, t: String): String = "{\"error\":\"HPKE not implemented\"}"

        private fun pullAndDecrypt(): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: throw IOException("Not provisioned")
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val req = okhttp3.Request.Builder().url("$base/api/messages/pull")
                .header("x-device-id", did).header("x-device-auth", dauth)
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), "{}")).build()
            
            return client.newCall(req).execute().use { resp ->
                val body = resp.body?.string() ?: "[]"
                if (!resp.isSuccessful) throw IOException("Error: $body")
                body
            }
        }

        private fun createInvite(hint: String?, ttl: Int): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: throw IOException("Not provisioned")
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val json = org.json.JSONObject().put("ttl_minutes", ttl)
            if(hint != null) json.put("friend_hint", hint)
            val req = okhttp3.Request.Builder().url("$base/api/invite/create")
                .header("x-device-id", did).header("x-device-auth", dauth)
                .post(okhttp3.RequestBody.create("application/json".toMediaType(), json.toString())).build()
            
            return client.newCall(req).execute().use { resp ->
                val body = resp.body?.string() ?: "{}"
                if (!resp.isSuccessful) throw IOException("Error: $body")
                body
            }
        }

        private fun getMe(): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: return "{}"
            val base = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val req = okhttp3.Request.Builder().url("$base/api/me")
                .header("x-device-id", did).header("x-device-auth", dauth).get().build()
            
            return try {
                client.newCall(req).execute().use { 
                    if (it.isSuccessful) it.body?.string() ?: "{}" else "{}" 
                }
            } catch (e: Exception) { "{}" }
        }

        private fun notify(title: String, body: String): String {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val chan = NotificationChannel("zerochat", "Messages", NotificationManager.IMPORTANCE_DEFAULT)
                getSystemService(NotificationManager::class.java).createNotificationChannel(chan)
            }
            val notif = NotificationCompat.Builder(this@MainActivity, "zerochat")
                .setSmallIcon(android.R.drawable.ic_dialog_info)
                .setContentTitle(title).setContentText(body).setAutoCancel(true).build()
            NotificationManagerCompat.from(this@MainActivity).notify(System.currentTimeMillis().toInt(), notif)
            return "\"ok\""
        }

        private fun pickFile(accept: String?, multiple: Boolean): String {
            return "{\"error\":\"Native file picker not connected\"}"
        }

        private fun getToken(): String {
            val (did, dauth) = SharedPrefsHelper.getCredentials(this@MainActivity) ?: return "null"
            return org.json.JSONObject().put("device_id", did).put("device_auth", dauth).toString()
        }
        
        private fun loadCreds(): String = getToken()
        
        private fun openLink(url: String): String {
            return try {
                startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                "\"ok\""
            } catch (e: Exception) { "{\"error\":\"${e.message}\"}" }
        }
    }
}