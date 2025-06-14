import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';

/**
 * ScriptManager Component
 * Loads and manages third-party scripts based on settings from the API
 */
const ScriptManager = () => {
  const [scripts, setScripts] = useState({
    tawkTo: { active: false },
    messenger: { active: false },
    googleAnalytics: { active: false },
    googleRecaptcha: { active: false }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScriptSettings = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/scripts/public`);
        
        if (response.data && response.data.data) {
          setScripts(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching script settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchScriptSettings();
  }, []);

  // Initialize Facebook Messenger
  useEffect(() => {
    if (scripts.messenger.active && scripts.messenger.pageId) {
      window.fbAsyncInit = function() {
        window.FB.init({
          xfbml: true,
          version: 'v18.0'
        });
      };

      // Load Facebook SDK
      (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));
    }
  }, [scripts.messenger]);

  if (loading) {
    return null; // Don't render anything while loading
  }

  return (
    <Helmet>
      {/* Google Analytics */}
      {scripts.googleAnalytics.active && scripts.googleAnalytics.code && (
        <>
          <script async src={`https://www.googletagmanager.com/gtag/js?id=${scripts.googleAnalytics.code}`}></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${scripts.googleAnalytics.code}');
            `}
          </script>
        </>
      )}

      {/* Google reCAPTCHA */}
      {scripts.googleRecaptcha.active && scripts.googleRecaptcha.siteKey && (
        <script src={`https://www.google.com/recaptcha/api.js?render=${scripts.googleRecaptcha.siteKey}`}></script>
      )}

      {/* Tawk.to Chat */}
      {scripts.tawkTo.active && scripts.tawkTo.widgetCode && (
        <script>
          {`
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/${scripts.tawkTo.widgetCode}';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `}
        </script>
      )}

      {/* Facebook Messenger Chat */}
      {scripts.messenger.active && scripts.messenger.pageId && (
        <>
          {/* Messenger Chat Plugin Code */}
          <div id="fb-root"></div>
          <div id="fb-customer-chat" className="fb-customerchat" 
               attribution="biz_inbox" 
               page_id={scripts.messenger.pageId}>
          </div>
        </>
      )}
    </Helmet>
  );
};

export default ScriptManager;