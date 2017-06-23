package com.wdrn;

import android.os.Bundle;
import android.view.KeyEvent;

import com.facebook.react.ReactActivity;

public class MainActivity extends ReactActivity  {

    public static MainActivity activity;
    public onBackClickListener listener;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        activity = this;

    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "wdrn";
    }


    public void setOnbackListener(onBackClickListener listener) {

        this.listener = listener;
    }
    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
//        if(keyCode == KeyEvent.KEYCODE_BACK){
//            listener.onBack();
//
//            return true;
//        }
        return  super.onKeyDown(keyCode, event);
    }

}
