package com.wdrn;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.SimpleDateFormat;
import java.util.Date;

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

    private String getTimeMillis() {
        SimpleDateFormat formatDate = new SimpleDateFormat("yyyy年MM月dd日  HH:mm:ss");
        Date date = new Date(System.currentTimeMillis());
        String time = formatDate.format(date);
        return time;
    }

    /**
     * 该方法用于给JavaScript进行调用
     */
    @ReactMethod
    public void show(final Callback callback) {
        MainActivity.activity.setOnbackListener(new onBackClickListener() {
            @Override
            public void onBack() {

                callback.invoke(getTimeMillis());
            }
        });
    }


}