package com.speaker;

import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen;

import android.os.Build;
import android.os.Bundle;

import androidx.annotation.RequiresApi;

import io.invertase.notifee.NotifeeApiModule;

import com.kevinresol.react_native_sound_recorder.RNSoundRecorderPackage;

public class MainActivity extends ReactActivity {

    @RequiresApi(api = Build.VERSION_CODES.O)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        SplashScreen.show(this, R.style.SplashTheme);
        super.onCreate(null);
    }

    @Override
    protected String getMainComponentName() {
        return NotifeeApiModule.getMainComponent("speaker");
    }
  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
//  @Override
//  protected String getMainComponentName() {
//    return "speaker";
//  }
}
