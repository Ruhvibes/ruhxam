package com.ruhxam.app;

import android.app.Activity;
import android.content.Context;
import android.os.Build;
import android.os.Bundle;
import android.os.VibrationEffect;
import android.os.Vibrator;
import android.os.VibratorManager;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.View;
import android.view.WindowManager;
import android.webkit.JavascriptInterface;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.LinearLayout;

import com.google.android.gms.ads.AdListener;
import com.google.android.gms.ads.AdRequest;
import com.google.android.gms.ads.AdSize;
import com.google.android.gms.ads.AdView;
import com.google.android.gms.ads.LoadAdError;
import com.google.android.gms.ads.MobileAds;
import com.google.android.gms.ads.RequestConfiguration;

/** RuhXam — WebView wrapper for RRB NTPC + Group D exam prep.
 *  WebView on top + AdMob banner at the bottom (hidden on quiz/test screens
 *  via the setAdsVisible JS bridge). Ads never crash the app and are
 *  child-directed / max rating G. */
public class MainActivity extends Activity {
    private WebView web;
    private AdView adView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // Switch from the splash theme to the normal theme.
        setTheme(R.style.Theme_RuhXam);
        super.onCreate(savedInstanceState);
        // Keep the screen on during study sessions.
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);
        s.setMediaPlaybackRequiresUserGesture(false);
        s.setAllowFileAccess(true);
        try { s.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW); } catch (Exception ignored) {}

        web.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                // Keep everything inside the app for file:// pages.
                if (url != null && url.startsWith("file://")) return false;
                try {
                    android.content.Intent i = new android.content.Intent(
                            android.content.Intent.ACTION_VIEW,
                            android.net.Uri.parse(url));
                    startActivity(i);
                } catch (Exception ignored) {}
                return true;
            }
        });
        web.addJavascriptInterface(new JsBridge(), "Android");

        setContentView(buildLayoutWithAds());
        initAds();

        if (savedInstanceState != null) web.restoreState(savedInstanceState);
        else web.loadUrl("file:///android_asset/www/index.html");
    }

    /** WebView on top + AdMob banner at the bottom. */
    private LinearLayout buildLayoutWithAds() {
        LinearLayout root = new LinearLayout(this);
        root.setOrientation(LinearLayout.VERTICAL);
        LinearLayout.LayoutParams webLp = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, 0, 1f);
        web.setLayoutParams(webLp);
        root.addView(web);
        try {
            adView = new AdView(this);
            // Hasnain's real AdMob banner unit (shared with RuhStudy for now;
            // TODO: create a dedicated RuhXam App ID in the AdMob console).
            adView.setAdUnitId("ca-app-pub-1457912071506893/4479331241");
            adView.setAdSize(AdSize.BANNER);
            LinearLayout.LayoutParams adLp = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            adView.setLayoutParams(adLp);
            adView.setVisibility(View.GONE); // shown only after a successful fill
            root.addView(adView);
        } catch (Exception ignored) {}
        return root;
    }

    /** Initializes AdMob safely. Audience is students, so ads are marked
     *  child-directed with max content rating G. */
    private void initAds() {
        try {
            RequestConfiguration conf = new RequestConfiguration.Builder()
                    .setTagForChildDirectedTreatment(
                            RequestConfiguration.TAG_FOR_CHILD_DIRECTED_TREATMENT_TRUE)
                    .setMaxAdContentRating(RequestConfiguration.MAX_AD_CONTENT_RATING_G)
                    .build();
            MobileAds.setRequestConfiguration(conf);
            MobileAds.initialize(this, initializationStatus -> loadBannerAd());
        } catch (Exception ignored) {}
    }

    /** Loads banner ad with automatic retry on failure (up to 5 times). */
    private int adRetryCount = 0;
    private void loadBannerAd() {
        try {
            if (adView == null) return;
            adView.setAdListener(new AdListener() {
                @Override public void onAdLoaded() {
                    adRetryCount = 0;
                    try {
                        if (adsAllowedOnScreen) adView.setVisibility(View.VISIBLE);
                    } catch (Exception ignored) {}
                }
                @Override public void onAdFailedToLoad(LoadAdError error) {
                    if (adRetryCount < 5) {
                        adRetryCount++;
                        adView.postDelayed(() -> loadBannerAd(), 30000 * adRetryCount);
                    }
                }
            });
            adView.loadAd(new AdRequest.Builder().build());
        } catch (Exception ignored) {}
    }

    private boolean adsAllowedOnScreen = true;

    private class JsBridge {
        /** Called from JS: hide the banner on quiz/test screens, show on
         *  home/study screens. Runs on a binder thread — post to UI. */
        @JavascriptInterface
        public void setAdsVisible(final boolean visible) {
            adsAllowedOnScreen = visible;
            runOnUiThread(() -> {
                try {
                    if (adView != null) {
                        adView.setVisibility(visible ? View.VISIBLE : View.GONE);
                    }
                } catch (Exception ignored) {}
            });
        }

        @JavascriptInterface
        public void vibrate(final int ms) {
            try {
                Vibrator v;
                if (Build.VERSION.SDK_INT >= 31) {
                    VibratorManager vm = (VibratorManager) getSystemService(Context.VIBRATOR_MANAGER_SERVICE);
                    v = vm.getDefaultVibrator();
                } else {
                    v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                }
                if (Build.VERSION.SDK_INT >= 26) v.vibrate(VibrationEffect.createOneShot(ms, VibrationEffect.DEFAULT_AMPLITUDE));
                else v.vibrate(ms);
            } catch (Exception ignored) {}
        }

        /** Prints the current WebView page (used for exporting notes to PDF). */
        @JavascriptInterface
        public void printPage(final String jobName) {
            runOnUiThread(() -> {
                try {
                    PrintManager pm = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                    PrintDocumentAdapter adapter = web.createPrintDocumentAdapter(jobName == null ? "RuhXam" : jobName);
                    pm.print(jobName == null ? "RuhXam" : jobName, adapter,
                            new PrintAttributes.Builder().build());
                } catch (Exception ignored) {}
            });
        }
    }

    @Override
    protected void onPause() {
        try { if (adView != null) adView.pause(); } catch (Exception ignored) {}
        super.onPause();
    }

    @Override
    protected void onResume() {
        super.onResume();
        try { if (adView != null) adView.resume(); } catch (Exception ignored) {}
    }

    @Override
    protected void onDestroy() {
        try { if (adView != null) adView.destroy(); } catch (Exception ignored) {}
        super.onDestroy();
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        super.onSaveInstanceState(outState);
        if (web != null) web.saveState(outState);
    }

    @Override
    public void onBackPressed() {
        // Let the web app handle back navigation first.
        try {
            web.evaluateJavascript("window.__ruhxamBack ? window.__ruhxamBack() : 'no'", v -> {
                if (!"yes".equals(v.replace("\"", ""))) MainActivity.super.onBackPressed();
            });
        } catch (Exception e) {
            super.onBackPressed();
        }
    }
}
