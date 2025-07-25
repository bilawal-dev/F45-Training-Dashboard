'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const folderID_slackChannel_Mapping = {
    '901310204055': 'C0970UM5DDM',
    '901310932004': 'C097BE9AFCK',
}

const ChatwootLoader = () => {

    const searchParams = useSearchParams();
    const folderId = searchParams.get('folderId');

    useEffect(() => {
        const loadChatwoot = () => {
            const BASE_URL = "https://app.chatwoot.com";
            const script = document.createElement('script');
            script.src = `${BASE_URL}/packs/js/sdk.js`;
            script.defer = true;
            script.async = true;

            script.onload = () => {
                // @ts-ignore
                if (window.chatwootSDK) {
                    // @ts-ignore
                    window.chatwootSDK.run({
                        websiteToken: 'EdMAHVMAch7UKDpnQoPKko3r',
                        baseUrl: BASE_URL,
                    });
                }
            };

            window.addEventListener('chatwoot:ready', () => {
                // @ts-ignore
                window.$chatwoot.setCustomAttributes({
                    slack_channel: slackChannel
                });
            });
            
            document.body.appendChild(script);
        };

        if (!folderId) {
            return;
        }

        const slackChannel = folderID_slackChannel_Mapping[folderId as keyof typeof folderID_slackChannel_Mapping] as string | null;

        if (!slackChannel) {
            return;
        }

        loadChatwoot();
        
        // Clean up script when the component unmounts
        return () => {
            // @ts-ignore
            if (window.$chatwoot && typeof window.$chatwoot.reset === 'function') {
                // @ts-ignore
                window.$chatwoot.reset();
            }

            const existingScript = document.querySelector(`script[src="https://app.chatwoot.com/packs/js/sdk.js"]`);
            if (existingScript) {
                existingScript.remove();
            }

            const widgetHolder = document.querySelector('.woot-widget-holder');
            if (widgetHolder) {
                widgetHolder.remove();
            }
        };
    }, [folderId]);

    return null;
};

export default ChatwootLoader;