// Import ThoughtSpot SDK
import {
  init,
  LiveboardEmbed,
  Action,
  RuntimeFilterOp,
  EmbedEvent,
  AuthType,
  HostEvent,
  CustomActionsPosition,
  CustomActionTarget
} from "@thoughtspot/visual-embed-sdk";
import "./styles.css";
import { getTokenService } from "./tokenService";
import { debounceFunc } from "./utils";
  
// Use prefetch to load static resources early and optimize response time. 
// Call init early to complete authentication during app load for better performance.
const initEvent = init({
  thoughtSpotHost:
    /*param-start-hosturl*/"https://insights.dealerware.com"/*param-end-hosturl*/,
/*param-start-styleCustomization*//*param-end-styleCustomization*/
  authType: AuthType.TrustedAuthTokenCookieless,
  getAuthToken: getTokenService,
  disableTokenVerification: true,
});

// Instantiate class for embedding a Liveboard
const embed = new LiveboardEmbed("#your-own-div", {
    frameParams: {},
    /*param-start-liveboardId*/
     liveboardId: "2b3c3696-030f-41be-8d83-f24b3da765a2",
/*param-end-liveboardId*/
/*param-start-activeTabId*//*param-end-activeTabId*/
/*param-start-liveboardFullHeight*//*param-end-liveboardFullHeight*/
/*param-start-customizeLiveboardHeader*//*param-end-customizeLiveboardHeader*/
/*param-start-hideLiveboardHeader*//*param-end-hideLiveboardHeader*/
/*param-start-runtimeFiltersAndParameters*/
    runtimeFilters: [{
      columnName: "Area Market",
      operator: RuntimeFilterOp.EQ,
      values: ["ATL"]               
    }],
/*param-end-runtimeFiltersAndParameters*/
/*param-start-modifyActions*//*param-end-modifyActions*/
/*param-start-exposeTranslationIds*//*param-end-exposeTranslationIds*/
/*param-start-codeBasedCustomActions*//*param-end-codeBasedCustomActions*/
});

hideNoDataImage();
showErrorBanner('none');

embed
    // Register event listeners
    .on(EmbedEvent.Init, showLoader)
    .on(EmbedEvent.LiveboardRendered, hideLoader)
    /*param-start-customActionHandle*//*param-end-customActionHandle*/
/*param-start-codeBasedCustomActionsHandle*//*param-end-codeBasedCustomActionsHandle*/
    .on(EmbedEvent.Error, (error) => {
        if(error?.data?.errorType === 'FULLSCREEN' || error?.data?.errorType === 'API') {
          showErrorBanner('none');
        } else 
        if(typeof(error.error) === 'string') {
          const liveBoardId = embed.viewConfig.liveboardId
          if(!liveBoardId){
            showNoDataImage();
          }
          showErrorBanner('flex', error.error);
        } else {
          showErrorBanner('flex');
        }
        console.log('Error ', error);
        hideLoader();
    })
    // Render Liveboard
    .render();

/*param-start-useHostEvent*//*param-end-useHostEvent*/

// Functions to show/hide
function setDisplayStyle(el, style) {
  if(document.getElementById(el)) {
    document.getElementById(el).style.display = style;
  }
}

// Functions to show and hide a loader while iframe loads
function showLoader() {
  setDisplayStyle("loader", "block");
}
function hideLoader() {
  setDisplayStyle("loader", "none");
}

// Functions to show or hide No data images
function showNoDataImage() {
  setDisplayStyle("no-data", "block");
}

function hideNoDataImage() {
  setDisplayStyle("no-data", "none");
}

function showErrorBanner(display, errorText) {
  setDisplayStyle("errorBanner", display);
  if(errorText) {
    document.getElementById("errorBanner").firstElementChild.innerText = errorText;
  }
}

document.getElementById('authExpiredBannerCloseBtn').addEventListener('click', () => {
  setDisplayStyle("authExpiredBanner", "none");
});

document.getElementById('errorBannerCloseBtn').addEventListener('click', () => {
  setDisplayStyle("errorBanner", "none");
});