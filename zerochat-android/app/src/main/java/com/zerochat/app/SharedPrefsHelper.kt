package com.zerochat.app

import android.content.Context
import android.content.SharedPreferences
import java.security.SecureRandom

object SharedPrefsHelper {
    private const val PREFS_NAME = "zerochat_prefs"
    private const val KEY_BASE_URL = "base_url"
    private const val KEY_DEVICE_ID = "device_id"
    private const val KEY_DEVICE_AUTH = "device_auth"
    private const val KEY_IDENTITY_KEY = "identity_key"
    
    private fun getPrefs(context: Context): SharedPreferences {
        return context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }
    
    fun setBaseUrl(context: Context, baseUrl: String) {
        getPrefs(context).edit().putString(KEY_BASE_URL, baseUrl).apply()
    }
    
    fun getBaseUrl(context: Context): String {
        return getPrefs(context).getString(KEY_BASE_URL, "http://127.0.0.1:8080") ?: "http://127.0.0.1:8080"
    }
    
    fun saveCredentials(context: Context, deviceId: String, deviceAuth: String) {
        getPrefs(context).edit()
            .putString(KEY_DEVICE_ID, deviceId)
            .putString(KEY_DEVICE_AUTH, deviceAuth)
            .apply()
    }
    
    fun getCredentials(context: Context): Pair<String, String>? {
        val deviceId = getPrefs(context).getString(KEY_DEVICE_ID, null)
        val deviceAuth = getPrefs(context).getString(KEY_DEVICE_AUTH, null)
        
        return if (deviceId != null && deviceAuth != null) {
            Pair(deviceId, deviceAuth)
        } else {
            null
        }
    }
    
    fun getOrGenerateIdentityKey(context: Context): ByteArray {
        val prefs = getPrefs(context)
        val existingKey = prefs.getString(KEY_IDENTITY_KEY, null)
        
        return if (existingKey != null) {
            android.util.Base64.decode(existingKey, android.util.Base64.URL_SAFE or android.util.Base64.NO_PADDING)
        } else {
            // Generate new 32-byte identity key
            val key = ByteArray(32)
            SecureRandom().nextBytes(key)
            val keyB64 = android.util.Base64.encodeToString(key, android.util.Base64.URL_SAFE or android.util.Base64.NO_PADDING)
            prefs.edit().putString(KEY_IDENTITY_KEY, keyB64).apply()
            key
        }
    }
}

