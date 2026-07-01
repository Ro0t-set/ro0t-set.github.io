/**
 * Analytics consent, Google Analytics and PostHog bootstrap.
 */
(function() {
    'use strict';

    const CONFIG = {
        consentKey: 'portfolio-cookie-consent',
        gaMeasurementId: 'G-8JSLCWYJYF',
        posthogToken: 'phc_xNhdREzHSmUE7d24JUju85GWxKw4iyjEPR8L2MpgajFT',
        posthogApiHost: 'https://t.tommasopatriti.me',
        posthogUiHost: 'https://eu.posthog.com',
        posthogDefaults: '2026-05-30'
    };

    let analyticsInitialized = false;

    function safeLocalStorage() {
        try {
            return window.localStorage;
        } catch (error) {
            return null;
        }
    }

    function getConsent() {
        const storage = safeLocalStorage();
        return storage ? storage.getItem(CONFIG.consentKey) : null;
    }

    function setConsent(value) {
        const storage = safeLocalStorage();
        if (storage) {
            storage.setItem(CONFIG.consentKey, value);
        }
    }

    function getLang() {
        const storage = safeLocalStorage();
        const saved = storage ? storage.getItem('portfolio-lang') : null;
        if (saved === 'en' || saved === 'it') {
            return saved;
        }
        return document.documentElement.lang === 'en' ? 'en' : 'it';
    }

    function copy() {
        return getLang() === 'en' ? {
            title: 'Cookie preferences',
            body: 'We use technical preferences and, with your consent, Google Analytics and PostHog for analytics and improvements.',
            accept: 'Accept',
            reject: 'Reject',
            privacy: 'Privacy & Cookie Policy',
            saved: 'Preference saved'
        } : {
            title: 'Preferenze cookie',
            body: 'Usiamo preferenze tecniche e, con il tuo consenso, Google Analytics e PostHog per statistiche e miglioramenti.',
            accept: 'Accetta',
            reject: 'Rifiuta',
            privacy: 'Privacy & Cookie Policy',
            saved: 'Preferenza salvata'
        };
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.async = true;
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    function initGoogleAnalytics() {
        const gaSrc = `https://www.googletagmanager.com/gtag/js?id=${CONFIG.gaMeasurementId}`;

        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function() {
            window.dataLayer.push(arguments);
        };

        window.gtag('consent', 'update', {
            analytics_storage: 'granted'
        });
        window.gtag('js', new Date());
        window.gtag('config', CONFIG.gaMeasurementId, {
            anonymize_ip: true
        });

        loadScript(gaSrc).catch(() => {});
    }

    function initPostHog() {
        if (window.posthog && window.posthog.__loaded) {
            return;
        }

        !function(t, e) {
            var o, n, p, r;
            e.__SV || (window.posthog && window.posthog.__loaded) || (window.posthog = e, e._i = [], e.init = function(i, s, a) {
                function g(t, e) {
                    var o = e.split('.');
                    2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function() {
                        t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
                    };
                }
                (p = t.createElement('script')).type = 'text/javascript';
                p.crossOrigin = 'anonymous';
                p.async = true;
                p.src = s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js';
                (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
                var u = e;
                for (void 0 !== a ? u = e[a] = [] : a = 'posthog', u.people = u.people || [], u.toString = function(t) {
                    var e = 'posthog';
                    return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
                }, u.people.toString = function() {
                    return u.toString(1) + '.people (stub)';
                }, o = 'init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload getFeatureFlagResult getAllFeatureFlags isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties unsetPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset setIdentity clearIdentity get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException addExceptionStep captureLog startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty createPersonProfile setInternalOrTestUser opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing debug getPageViewId captureTraceFeedback captureTraceMetric'.split(' '), n = 0; n < o.length; n++) {
                    g(u, o[n]);
                }
                e._i.push([i, s, a]);
            }, e.__SV = 1);
        }(document, window.posthog || []);

        window.posthog.init(CONFIG.posthogToken, {
            api_host: CONFIG.posthogApiHost,
            ui_host: CONFIG.posthogUiHost,
            defaults: CONFIG.posthogDefaults,
            person_profiles: 'identified_only'
        });
    }

    function initAnalytics() {
        if (analyticsInitialized) {
            return;
        }

        analyticsInitialized = true;
        initGoogleAnalytics();
        initPostHog();
    }

    function deleteCookie(name) {
        const hostParts = window.location.hostname.split('.');
        const domains = ['', window.location.hostname];

        if (hostParts.length > 2) {
            domains.push(`.${hostParts.slice(-2).join('.')}`);
        }

        domains.forEach(domain => {
            const domainPart = domain ? `; domain=${domain}` : '';
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}; SameSite=Lax`;
        });
    }

    function clearAnalyticsStorage() {
        document.cookie.split(';').forEach(cookie => {
            const name = cookie.split('=')[0].trim();
            if (name === '_ga' || name === '_gid' || name === '_gat' || name.startsWith('_ga_') || name.startsWith('ph_')) {
                deleteCookie(name);
            }
        });

        const storage = safeLocalStorage();
        if (storage) {
            Object.keys(storage).forEach(key => {
                if (key.startsWith('ph_') || key.startsWith('posthog')) {
                    storage.removeItem(key);
                }
            });
        }

        if (window.posthog && typeof window.posthog.opt_out_capturing === 'function') {
            window.posthog.opt_out_capturing();
        }
    }

    function closeBanner() {
        const banner = document.getElementById('cookieConsent');
        if (banner) {
            banner.remove();
        }
    }

    function showSavedNotice() {
        const text = copy().saved;
        const notice = document.createElement('div');
        notice.className = 'cookie-toast';
        notice.textContent = text;
        document.body.appendChild(notice);
        window.setTimeout(() => notice.remove(), 2200);
    }

    function showBanner(force) {
        if (!force && getConsent()) {
            return;
        }

        closeBanner();

        const text = copy();
        const banner = document.createElement('div');
        banner.className = 'cookie-consent';
        banner.id = 'cookieConsent';
        banner.setAttribute('role', 'dialog');
        banner.setAttribute('aria-live', 'polite');
        banner.setAttribute('aria-label', text.title);

        banner.innerHTML = `
            <div class="cookie-consent-copy">
                <strong>${text.title}</strong>
                <p>${text.body}</p>
                <a href="/#privacy">${text.privacy}</a>
            </div>
            <div class="cookie-consent-actions">
                <button type="button" class="cookie-btn cookie-btn-secondary" data-cookie-choice="rejected">${text.reject}</button>
                <button type="button" class="cookie-btn cookie-btn-primary" data-cookie-choice="accepted">${text.accept}</button>
            </div>
        `;

        banner.addEventListener('click', event => {
            const button = event.target.closest('[data-cookie-choice]');
            if (!button) {
                return;
            }

            const choice = button.getAttribute('data-cookie-choice');
            setConsent(choice);

            if (choice === 'accepted') {
                initAnalytics();
            } else {
                clearAnalyticsStorage();
            }

            closeBanner();
            showSavedNotice();
        });

        document.body.appendChild(banner);
    }

    function bindPreferenceLinks() {
        document.querySelectorAll('[data-cookie-preferences]').forEach(link => {
            link.addEventListener('click', event => {
                event.preventDefault();
                showBanner(true);
            });
        });
    }

    function init() {
        bindPreferenceLinks();

        if (getConsent() === 'accepted') {
            initAnalytics();
        } else if (!getConsent()) {
            showBanner(false);
        }
    }

    window.openCookiePreferences = function() {
        showBanner(true);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
