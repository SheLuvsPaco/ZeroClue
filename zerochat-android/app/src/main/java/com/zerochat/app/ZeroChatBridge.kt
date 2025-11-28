package com.zerochat.app

import android.content.Context
import android.webkit.JavascriptInterface
import android.webkit.WebView
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

class ZeroChatBridge(private val webView: WebView, private val ctx: Context) {

    private val prefs = ctx.getSharedPreferences("zerochat", Context.MODE_PRIVATE)
    private val client = OkHttpClient()

    private fun persist(deviceId: String, token: String, base: String) {
        prefs.edit()
            .putString("device_id", deviceId)
            .putString("token", token)
            .putString("base", base)
            .apply()
    }

    @JavascriptInterface
    fun getCreds(): String {
        val obj = JSONObject()
        obj.put("device_id", prefs.getString("device_id", ""))
        obj.put("token", prefs.getString("token", ""))
        obj.put("base", prefs.getString("base", ""))
        return obj.toString()
    }

    /**
     * Provision the device by calling the server's /api/provision/redeem endpoint.
     * This method performs network I/O on a background thread and blocks until done,
     * then returns a JSON string result to JS.
     */
    @JavascriptInterface
    fun provision(token: String, base: String): String {
        val latch = CountDownLatch(1)
        val resultHolder = arrayOf("{}")

        Thread {
            val urlBase = if (base.isNotEmpty()) base else "http://127.0.0.1:8080"
            val url = "${urlBase.trimEnd('/')}/api/provision/redeem"

            val bodyJson = JSONObject()
            bodyJson.put("provision_token", token)

            val req = Request.Builder()
                .url(url)
                .post(
                    bodyJson.toString()
                        .toRequestBody("application/json".toMediaType())
                )
                .build()

            val result = try {
                client.newCall(req).execute().use { resp ->
                    val body = resp.body?.string() ?: "{}"
                    if (!resp.isSuccessful) {
                        """{"ok":false,"status":${resp.code},"body":$body}"""
                    } else {
                        val obj = JSONObject(body)
                        val deviceId = obj.optString("device_id", "")
                        persist(deviceId, token, urlBase)
                        """{"ok":true,"device_id":"$deviceId"}"""
                    }
                }
            } catch (e: Exception) {
                """{"ok":false,"error":"${e.message}"}"""
            }

            resultHolder[0] = result
            latch.countDown()
        }.start()

        // Wait up to 15 seconds for network
        latch.await(15, TimeUnit.SECONDS)
        return resultHolder[0]
    }
}


