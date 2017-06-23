package com.wdrn;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import static com.wdrn.MainActivity.activity;

/**
 * Created by Administrator on 2017/6/23 0023.
 */

public class FastBack extends ReactContextBaseJavaModule {

    public FastBack(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Back";
    }

    /**
     * 该方法用于给JavaScript进行调用
     */
    @ReactMethod
    public void show(final Promise promise) {
        MainActivity.activity.setOnbackListener(new onBackClickListener() {
            @Override
            public void onBack() {
                promise.resolve("");
            }
        });
    }


}