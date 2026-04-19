package com.whatbm.metacleaner

import android.os.Bundle // custom
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate
import com.zoontek.rnbootsplash.RNBootSplash // new for splash

class MainActivity : ReactActivity() {

  override fun onCreate(savedInstanceState: Bundle?) {
      // You MUST pass the theme you defined in styles.xml
      RNBootSplash.init(this, R.style.BootTheme) 
      super.onCreate(null)
  }

  override fun getMainComponentName(): String = "MetadataRemover"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}