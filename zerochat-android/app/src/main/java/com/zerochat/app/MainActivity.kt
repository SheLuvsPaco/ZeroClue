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
import android.provider.MediaStore
import android.content.ActivityNotFoundException
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient

class MainActivity : ComponentActivity() {
    private lateinit var web: WebView

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        web = WebView(this)
        setContentView(web)

        // Enable WebView debugging
        WebView.setWebContentsDebuggingEnabled(true)

        val ws: WebSettings = web.settings
        ws.javaScriptEnabled = true
        ws.domStorageEnabled = true
        ws.allowFileAccess = true
        ws.allowContentAccess = true
        ws.userAgentString = ws.userAgentString + " ZeroChat/Android"

        web.webViewClient = object : WebViewClient() {
            override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
                super.onPageStarted(view, url, favicon)
                android.util.Log.d("ZeroChat", "Page started loading: $url")
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                android.util.Log.d("ZeroChat", "Page finished loading: $url")
            }

            override fun onReceivedError(view: WebView?, request: android.webkit.WebResourceRequest?, error: android.webkit.WebResourceError?) {
                super.onReceivedError(view, request, error)
                android.util.Log.e("ZeroChat", "WebView error: ${error?.description} for ${request?.url}")
            }

            override fun shouldOverrideUrlLoading(view: WebView, url: String): Boolean {
                android.util.Log.d("ZeroChat", "URL loading: $url")
                // Let http/https load inside the WebView
                if (url.startsWith("http://") || url.startsWith("https://")) return false
                // For zerochat:// bring it back to JS / app
                if (url.startsWith("zerochat://")) {
                    handleZerochatUri(Uri.parse(url))
                    return true
                }
                // Everything else open via intent
                return try {
                    startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(url)))
                    true
                } catch (_: Exception) {
                    true
                }
            }
        }

        web.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: android.webkit.ConsoleMessage?): Boolean {
                android.util.Log.d("ZeroChat-Console", "${consoleMessage?.message()} -- From line ${consoleMessage?.lineNumber()} of ${consoleMessage?.sourceId()}")
                return true
            }
        }
        web.addJavascriptInterface(ZeroChatBridge(), "ZeroChatBridge")

        // load bundled UI (copied into assets/www by our sync script)
        web.loadUrl("file:///android_asset/www/index.html")

        // handle deep link if the app was launched by an invite
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
        val inviter = uri.getQueryParameter("inviter") ?: ""
        
        android.util.Log.d("ZeroChat", "Deep link: token=${token.take(8)}..., base=$base, inviter=$inviter")
        
        // deliver token to the web app
        runOnUiThread {
            // Store base URL if provided
            if (base.isNotEmpty()) {
                SharedPrefsHelper.setBaseUrl(this, base)
            }
            
            // Call the JavaScript handler with token
            // The handler should store the token and base URL
            val jsCode = """
                (function() {
                    if (window.__zerochatProvision) {
                        window.__zerochatProvision(${escapeJs(token)});
                    } else {
                        // Handler not ready yet, store in localStorage temporarily
                        localStorage.setItem('zerochat_pending_invite_token', ${escapeJs(token)});
                        ${if (base.isNotEmpty()) "localStorage.setItem('zerochat_pending_invite_base', ${escapeJs(base)});" else ""}
                        console.log('[Android] Stored invite token, waiting for handler...');
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
        @JavascriptInterface
        fun ping(): String = "pong"
        
        @JavascriptInterface
        fun invoke(cmd: String, argsJson: String): String {
            return try {
                val args = if (argsJson.isNotEmpty()) {
                    org.json.JSONObject(argsJson)
                } else {
                    org.json.JSONObject()
                }
                
                when (cmd) {
                    "set_base" -> {
                        val base = args.optString("base", "http://127.0.0.1:8080")
                        SharedPrefsHelper.setBaseUrl(this@MainActivity, base)
                        "\"ok\""
                    }
                    "signup" -> {
                        val username = args.optString("username", "")
                        val password = args.optString("password", "")
                        val baseUrl = args.optString("base_url", SharedPrefsHelper.getBaseUrl(this@MainActivity))
                        val inviteToken = if (args.has("invite_token") && !args.isNull("invite_token")) {
                            args.optString("invite_token", null)
                        } else {
                            null
                        }
                        signup(username, password, baseUrl, inviteToken)
                    }
                    "login" -> {
                        val username = args.optString("username", "")
                        val password = args.optString("password", "")
                        val baseUrl = args.optString("base_url", SharedPrefsHelper.getBaseUrl(this@MainActivity))
                        login(username, password, baseUrl)
                    }
                    "provision_with_token" -> {
                        val token = args.optString("token", "")
                        val baseUrl = args.optString("base_url", SharedPrefsHelper.getBaseUrl(this@MainActivity))
                        provisionWithToken(token, baseUrl)
                    }
                    "upload_identity_and_keypackage" -> {
                        uploadIdentityAndKeypackage()
                    }
                    "get_me" -> {
                        getMe()
                    }
                    "load_creds" -> {
                        loadCreds()
                    }
                    "friends_list" -> {
                        friendsList()
                    }
                    "friend_request" -> {
                        val toUsername = args.optString("to_username", "")
                        friendRequest(toUsername)
                    }
                    "friend_respond" -> {
                        val fromUsername = args.optString("from_username", "")
                        val accept = args.optBoolean("accept", false)
                        friendRespond(fromUsername, accept)
                    }
                    "send_to_username_hpke" -> {
                        val username = args.optString("username", "")
                        val plaintext = args.optString("plaintext", "")
                        sendToUsernameHpke(username, plaintext)
                    }
                    "pull_and_decrypt" -> {
                        pullAndDecrypt()
                    }
                    "create_invite" -> {
                        val friendHint = args.optString("friend_hint", null)
                        val ttlMinutes = args.optInt("ttl_minutes", 60)
                        createInvite(friendHint, ttlMinutes)
                    }
                    "getToken" -> {
                        getToken()
                    }
                    "pickFile" -> {
                        val accept = args.optString("accept", null)
                        val multiple = args.optBoolean("multiple", false)
                        pickFile(accept, multiple)
                    }
                    "notify" -> {
                        val title = args.optString("title", "")
                        val body = args.optString("body", "")
                        notify(title, body)
                    }
                    "openLink" -> {
                        val url = args.optString("url", "")
                        openLink(url)
                    }
                    else -> {
                        "{\"error\":\"Unknown command: $cmd\"}"
                    }
                }
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun signup(username: String, password: String, baseUrl: String, inviteToken: String?): String {
            return try {
                val httpClient = OkHttpClient()
                val signupUrl = "$baseUrl/api/signup"

                val requestBody = org.json.JSONObject().apply {
                    put("username", username)
                    put("password", password)
                    // Add invite_token if provided
                    if (inviteToken != null) {
                        put("invite_token", inviteToken)
                        android.util.Log.d("ZeroChat", "Signup: Including invite token")
                    }
                }

                val request = okhttp3.Request.Builder()
                    .url(signupUrl)
                    .post(okhttp3.RequestBody.create(
                        "application/json".toMediaType(),
                        requestBody.toString()
                    ))
                    .build()

                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""

                if (!response.isSuccessful) {
                    return "{\"error\":\"HTTP ${response.code}: $responseBody\"}"
                }

                val signupResp = org.json.JSONObject(responseBody)
                val provisionToken = signupResp.getString("provision_token")

                // Redeem provision token
                val deviceId = provisionWithTokenInternal(provisionToken, baseUrl)

                // Upload identity and keypackage
                uploadIdentityAndKeypackageInternal()

                "{\"device_id\":\"$deviceId\"}"
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun login(username: String, password: String, baseUrl: String): String {
            return try {
                val httpClient = OkHttpClient()
                val loginUrl = "$baseUrl/api/login"
                
                val requestBody = org.json.JSONObject().apply {
                    put("username", username)
                    put("password", password)
                }
                
                val request = okhttp3.Request.Builder()
                    .url(loginUrl)
                    .post(okhttp3.RequestBody.create(
                        "application/json".toMediaType(),
                        requestBody.toString()
                    ))
                    .build()
                
                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                
                if (!response.isSuccessful) {
                    return "{\"error\":\"HTTP ${response.code}: $responseBody\"}"
                }
                
                val loginResp = org.json.JSONObject(responseBody)
                val provisionToken = loginResp.getString("provision_token")
                
                // Redeem provision token
                val deviceId = provisionWithTokenInternal(provisionToken, baseUrl)
                
                // Upload identity and keypackage
                uploadIdentityAndKeypackageInternal()
                
                "{\"device_id\":\"$deviceId\"}"
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun provisionWithToken(token: String, baseUrl: String): String {
            return try {
                val deviceId = provisionWithTokenInternal(token, baseUrl)
                "{\"device_id\":\"$deviceId\"}"
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun provisionWithTokenInternal(token: String, baseUrl: String): String {
            val httpClient = OkHttpClient()
            val redeemUrl = "$baseUrl/api/provision/redeem"
            
            val requestBody = org.json.JSONObject().apply {
                put("token", token)
                put("platform", "android")
                put("push_token", org.json.JSONObject.NULL)
            }
            
            val request = okhttp3.Request.Builder()
                .url(redeemUrl)
                .post(okhttp3.RequestBody.create(
                    "application/json".toMediaType(),
                    requestBody.toString()
                ))
                .build()
            
            val response = httpClient.newCall(request).execute()
            val responseBody = response.body?.string() ?: ""
            
            if (!response.isSuccessful) {
                throw Exception("HTTP ${response.code}: $responseBody")
            }
            
            val redeemResp = org.json.JSONObject(responseBody)
            val deviceId = redeemResp.getString("device_id")
            val deviceAuth = redeemResp.optString("device_auth", redeemResp.optString("device_token", ""))
            
            // Save credentials
            SharedPrefsHelper.saveCredentials(this@MainActivity, deviceId, deviceAuth)
            
            return deviceId
        }
        
        private fun uploadIdentityAndKeypackage(): String {
            return try {
                uploadIdentityAndKeypackageInternal()
                "\"ok\""
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun uploadIdentityAndKeypackageInternal() {
            val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                ?: throw Exception("Not provisioned")
            
            val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
            val httpClient = OkHttpClient()
            
            // Generate or load identity key
            val identityKey = SharedPrefsHelper.getOrGenerateIdentityKey(this@MainActivity)
            val identityKeyB64 = android.util.Base64.encodeToString(identityKey, android.util.Base64.URL_SAFE or android.util.Base64.NO_PADDING)
            
            // Set identity
            val setIdentityUrl = "$baseUrl/api/keys/set_identity"
            val setIdentityBody = org.json.JSONObject().apply {
                put("device_id", deviceId)
                put("identity_key_b64", identityKeyB64)
            }
            
            val setIdentityRequest = okhttp3.Request.Builder()
                .url(setIdentityUrl)
                .header("x-device-id", deviceId)
                .header("x-device-auth", deviceAuth)
                .post(okhttp3.RequestBody.create(
                    "application/json".toMediaType(),
                    setIdentityBody.toString()
                ))
                .build()
            
            val setIdentityResponse = httpClient.newCall(setIdentityRequest).execute()
            if (!setIdentityResponse.isSuccessful) {
                throw Exception("Failed to set identity: ${setIdentityResponse.code}")
            }
            
            // Generate keypackage (random 200 bytes)
            val keypackageBytes = ByteArray(200)
            java.security.SecureRandom().nextBytes(keypackageBytes)
            val keypackageB64 = android.util.Base64.encodeToString(keypackageBytes, android.util.Base64.URL_SAFE or android.util.Base64.NO_PADDING)
            
            // Upload keypackage
            val uploadKpUrl = "$baseUrl/api/keys/upload_keypackage"
            val uploadKpBody = org.json.JSONObject().apply {
                put("keypackage_b64", keypackageB64)
            }
            
            val uploadKpRequest = okhttp3.Request.Builder()
                .url(uploadKpUrl)
                .header("x-device-id", deviceId)
                .header("x-device-auth", deviceAuth)
                .post(okhttp3.RequestBody.create(
                    "application/json".toMediaType(),
                    uploadKpBody.toString()
                ))
                .build()
            
            val uploadKpResponse = httpClient.newCall(uploadKpRequest).execute()
            if (!uploadKpResponse.isSuccessful) {
                throw Exception("Failed to upload keypackage: ${uploadKpResponse.code}")
            }
        }
        
        private fun getMe(): String {
            return try {
                val (deviceId, _) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: throw Exception("Not provisioned")
                
                val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
                val httpClient = OkHttpClient()
                val meUrl = "$baseUrl/api/me"
                
                val request = okhttp3.Request.Builder()
                    .url(meUrl)
                    .header("x-device-id", deviceId)
                    .header("x-device-auth", SharedPrefsHelper.getCredentials(this@MainActivity)!!.second)
                    .get()
                    .build()
                
                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                
                if (!response.isSuccessful) {
                    throw Exception("HTTP ${response.code}: $responseBody")
                }
                
                responseBody
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun loadCreds(): String {
            return try {
                val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: return "null"
                
                org.json.JSONObject().apply {
                    put("device_id", deviceId)
                    put("device_auth", deviceAuth)
                }.toString()
            } catch (e: Exception) {
                "null"
            }
        }
        
        private fun friendsList(): String {
            return try {
                val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: throw Exception("Not provisioned")
                
                val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
                val httpClient = OkHttpClient()
                val friendsUrl = "$baseUrl/api/friends/list"
                
                val request = okhttp3.Request.Builder()
                    .url(friendsUrl)
                    .header("x-device-id", deviceId)
                    .header("x-device-auth", deviceAuth)
                    .get()
                    .build()
                
                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                
                if (!response.isSuccessful) {
                    throw Exception("HTTP ${response.code}: $responseBody")
                }
                
                responseBody
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun friendRequest(toUsername: String): String {
            return try {
                val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: throw Exception("Not provisioned")
                
                val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
                val httpClient = OkHttpClient()
                val requestUrl = "$baseUrl/api/friends/request"
                
                val requestBody = org.json.JSONObject().apply {
                    put("to_username", toUsername)
                }
                
                val request = okhttp3.Request.Builder()
                    .url(requestUrl)
                    .header("x-device-id", deviceId)
                    .header("x-device-auth", deviceAuth)
                    .post(okhttp3.RequestBody.create(
                        "application/json".toMediaType(),
                        requestBody.toString()
                    ))
                    .build()
                
                val response = httpClient.newCall(request).execute()
                if (!response.isSuccessful) {
                    val errorBody = response.body?.string() ?: ""
                    throw Exception("HTTP ${response.code}: $errorBody")
                }
                
                "\"ok\""
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun friendRespond(fromUsername: String, accept: Boolean): String {
            return try {
                val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: throw Exception("Not provisioned")
                
                val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
                val httpClient = OkHttpClient()
                val requestUrl = "$baseUrl/api/friends/respond"
                
                val requestBody = org.json.JSONObject().apply {
                    put("from_username", fromUsername)
                    put("accept", accept)
                }
                
                val request = okhttp3.Request.Builder()
                    .url(requestUrl)
                    .header("x-device-id", deviceId)
                    .header("x-device-auth", deviceAuth)
                    .post(okhttp3.RequestBody.create(
                        "application/json".toMediaType(),
                        requestBody.toString()
                    ))
                    .build()
                
                val response = httpClient.newCall(request).execute()
                if (!response.isSuccessful) {
                    val errorBody = response.body?.string() ?: ""
                    throw Exception("HTTP ${response.code}: $errorBody")
                }
                
                "\"ok\""
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun sendToUsernameHpke(username: String, plaintext: String): String {
            // Simplified - would need HPKE implementation
            return "{\"error\":\"HPKE not yet implemented on Android\"}"
        }
        
        private fun pullAndDecrypt(): String {
            return try {
                val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: throw Exception("Not provisioned")
                
                val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
                val httpClient = OkHttpClient()
                val pullUrl = "$baseUrl/api/messages/pull"
                
                val request = okhttp3.Request.Builder()
                    .url(pullUrl)
                    .header("x-device-id", deviceId)
                    .header("x-device-auth", deviceAuth)
                    .post(okhttp3.RequestBody.create(
                        "application/json".toMediaType(),
                        "{}"
                    ))
                    .build()
                
                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                
                if (!response.isSuccessful) {
                    throw Exception("HTTP ${response.code}: $responseBody")
                }
                
                // Parse messages (decryption not yet implemented for Android)
                val messages = org.json.JSONArray(responseBody)
                val decrypted = org.json.JSONArray()
                for (i in 0 until messages.length()) {
                    // Decryption requires Rust crypto bindings for Android
                    decrypted.put("Encrypted message $i")
                }
                
                decrypted.toString()
            } catch (e: Exception) {
                "[]"
            }
        }
        
        private fun createInvite(friendHint: String?, ttlMinutes: Int): String {
            return try {
                val (deviceId, deviceAuth) = SharedPrefsHelper.getCredentials(this@MainActivity)
                    ?: throw Exception("Not provisioned")
                
                val baseUrl = SharedPrefsHelper.getBaseUrl(this@MainActivity)
                val httpClient = OkHttpClient()
                val inviteUrl = "$baseUrl/api/invite/create"
                
                val requestBody = org.json.JSONObject().apply {
                    if (friendHint != null) {
                        put("friend_hint", friendHint)
                    }
                    put("ttl_minutes", ttlMinutes)
                }
                
                val request = okhttp3.Request.Builder()
                    .url(inviteUrl)
                    .header("x-device-id", deviceId)
                    .header("x-device-auth", deviceAuth)
                    .post(okhttp3.RequestBody.create(
                        "application/json".toMediaType(),
                        requestBody.toString()
                    ))
                    .build()
                
                val response = httpClient.newCall(request).execute()
                val responseBody = response.body?.string() ?: ""
                
                if (!response.isSuccessful) {
                    throw Exception("HTTP ${response.code}: $responseBody")
                }
                
                responseBody
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun getToken(): String {
            return try {
                val creds = SharedPrefsHelper.getCredentials(this@MainActivity)
                if (creds != null) {
                    org.json.JSONObject().apply {
                        put("device_id", creds.first)
                        put("device_auth", creds.second)
                    }.toString()
                } else {
                    "null"
                }
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun pickFile(accept: String?, multiple: Boolean): String {
            return try {
                // Launch file picker intent
                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    type = "*/*"
                    if (accept != null) {
                        // Parse accept string (e.g., "image/*,application/pdf")
                        putExtra(Intent.EXTRA_MIME_TYPES, accept.split(",").map { it.trim() }.toTypedArray())
                    }
                    if (multiple) {
                        putExtra(Intent.EXTRA_ALLOW_MULTIPLE, true)
                    }
                    addCategory(Intent.CATEGORY_OPENABLE)
                }
                
                // For now, return a placeholder - in a real implementation,
                // you'd need to handle the activity result callback
                // This is a simplified version
                "{\"error\":\"File picker requires activity result handling - use invoke with callback\"}"
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun notify(title: String, body: String): String {
            return try {
                createNotificationChannel()
                
                val notificationId = System.currentTimeMillis().toInt()
                val notification = NotificationCompat.Builder(this@MainActivity, "zerochat_channel")
                    .setSmallIcon(android.R.drawable.ic_dialog_info)
                    .setContentTitle(title)
                    .setContentText(body)
                    .setPriority(NotificationCompat.PRIORITY_DEFAULT)
                    .setAutoCancel(true)
                    .build()
                
                val notificationManager = NotificationManagerCompat.from(this@MainActivity)
                notificationManager.notify(notificationId, notification)
                
                "\"ok\""
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun openLink(url: String): String {
            return try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                this@MainActivity.startActivity(intent)
                "\"ok\""
            } catch (e: ActivityNotFoundException) {
                "{\"error\":\"No app can handle this URL\"}"
            } catch (e: Exception) {
                "{\"error\":\"${e.message}\"}"
            }
        }
        
        private fun createNotificationChannel() {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                val channel = NotificationChannel(
                    "zerochat_channel",
                    "ZeroChat Notifications",
                    NotificationManager.IMPORTANCE_DEFAULT
                ).apply {
                    description = "Notifications for ZeroChat messages"
                }
                
                val notificationManager = this@MainActivity.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
                notificationManager.createNotificationChannel(channel)
            }
        }
    }
}
