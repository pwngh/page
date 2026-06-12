import { useCallback, useEffect } from 'react';
import { useFetcher, useNavigate, useSearchParams } from '@remix-run/react';

/**
 * Provide a stable handler that interprets pipe-delimited "do action" strings.
 *
 * Recognized formats (segment position is significant; the second segment of
 * window and form actions is reserved and currently ignored):
 * - `navigation|internal|<path>` - client-side navigation, replacing the current history entry.
 * - `navigation|external|<url>` - opens the URL in a new tab; an empty fourth segment (`...|<url>|`) opens it in the current tab instead.
 * - `window|<reserved>|click|<elementId>` - clicks the DOM element with that id.
 * - `window|<reserved>|trigger|<elementId>` - calls `window.__trigger[elementId]()`, as registered by the host app.
 * - `form|<reserved>|submit|<formId>` / `form|<reserved>|reset|<formId>` - submits or resets the form with that id.
 *
 * Any other non-empty action is POSTed to `/_api/doAction` as
 * `{ ...additionalParams, Do_Action, Params_Json }`, so the consuming Remix
 * app must define that route. An invalid action paired with `paramsJson`
 * instead writes the value to the `p` search param, which this hook strips
 * from the URL again once it has been applied.
 *
 * @returns {(doAction?: string, paramsJson?: string, additionalParams?: Object) => null} Action handler; always returns null.
 */
export function useDoActionHandler() {
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const doActionHandler = useCallback((doAction = '', paramsJson = '', additionalParams = {}) => {
    // A valid action is a non-empty, pipe-delimited string.
    if(!(doAction && typeof doAction === "string" && doAction.includes("|"))) {
      if(paramsJson) {
        setSearchParams(params => {
          params.set('p', `${paramsJson}`);
          return params;
        }, { replace: true, state: { scroll: false } });
      }

      return null;
    }

    const doActionParts = doAction.split('|');

    if(doActionParts[0] === "navigation") {
      const goToUrl = doActionParts[2];
      if(!goToUrl) {
        return null;
      }

      if(doActionParts[1] === "internal") {
        navigate(goToUrl, { replace: true });
        return null;
      }

      if(doActionParts[1] === "external") {
        if(typeof window !== "undefined") {
          // Only an explicitly empty fourth segment opts out of a new tab.
          const openInNew = doActionParts[3] !== '';
          if(!openInNew) {
            window.location.href = goToUrl;
            return null;
          }

          window.open(`${goToUrl}`, '_blank');
          return null;
        }
      }
    }

    else if(doActionParts[0] === "window") {
      const actionType = doActionParts[2];
      if(!actionType) {
        return null;
      }

      const elementId = doActionParts[3];
      if(!elementId) {
        return null;
      }

      if(typeof window !== "undefined") {
        if(actionType === "click") {
          try {
            const element = window.document.querySelectorAll(`#${elementId}`)[0];
            if(element && typeof element === "object" && 'click' in element) {
              element.click();
              return null;
            }
          } catch(e) {
            console.warn(e);
          }
        }

        else if(actionType === "trigger") {
          if('__trigger' in window && typeof window.__trigger === 'object' && elementId in window.__trigger) {
            window.__trigger[elementId]();
            return null;
          }
        }
      }
    }

    else if(doActionParts[0] === "form") {
      const formAction = doActionParts[2];
      if(!formAction) {
        return null;
      }

      const formId = doActionParts[3];
      if(!formId) {
        return null;
      }

      if(typeof window !== "undefined") {
        try {
          const formElement = window.document.querySelectorAll(`#${formId}`)[0];
          if(formElement && typeof formElement === "object") {
            if(formAction === "submit" && 'click' in formElement) {
              formElement.submit();
              return null;
            }

            if(formAction === "reset" && 'click' in formElement) {
              formElement.reset();
              return null;
            }
          }
        } catch(e) {
          console.warn(e);
        }
      }
    }

    else {
      const postData = { ...additionalParams, Do_Action: doAction, Params_Json: paramsJson };
      fetcher.submit(postData, { method: 'post', action: '/_api/doAction' });
    }

    return null;
  }, [fetcher, navigate, setSearchParams]);

  // Strip the `p` search param after it has been applied, keeping the visible URL clean.
  const hasParamsInTheUrl = searchParams.get('p');
  useEffect(() => {
    if(hasParamsInTheUrl) {
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }, [hasParamsInTheUrl]);

  return doActionHandler;
}
