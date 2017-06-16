package com.rebate;

import android.widget.Toast;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by Administrator on 2017/6/14 0014.
 */

public class PayReactAlipay extends ReactContextBaseJavaModule {
    public PayReactAlipay(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AliPAY";
    }
    /**
     * 该方法用于给JavaScript进行调用
     * @param message
     */
    @ReactMethod
    public void show(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }
}
