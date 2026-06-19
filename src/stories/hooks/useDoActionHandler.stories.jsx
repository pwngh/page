import React, { useEffect, useState } from 'react';
import { useDoActionHandler } from '../../react/hooks/useDoActionHandler.js';
import { withPage } from '../../../.storybook/decorators/page.jsx';

/**
 * Live demo for `useDoActionHandler`, which interprets pipe-delimited action
 * strings. Each button fires one branch; the log shows the observable effect.
 * (Navigation branches are omitted here so the demo stays on this route.)
 */
function UseDoActionDemo() {
  const doAction = useDoActionHandler();
  const [log, setLog] = useState([]);
  const append = (msg) => setLog((l) => [msg, ...l].slice(0, 8));

  // The `trigger` branch calls window.__trigger[id], which the host app registers.
  useEffect(() => {
    window.__trigger = window.__trigger || {};
    window.__trigger.ping = () => append('window.__trigger.ping() fired');
    return () => {
      if (window.__trigger) delete window.__trigger.ping;
    };
  }, []);

  const btn = 'rounded-md px-3 py-1.5 text-sm font-medium text-white';

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${btn} bg-indigo-500 hover:bg-indigo-600`} onClick={() => doAction('window|_|trigger|ping')}>
          window|_|trigger|ping
        </button>
        <button type="button" className={`${btn} bg-indigo-500 hover:bg-indigo-600`} onClick={() => doAction('window|_|click|demo-target')}>
          window|_|click|demo-target
        </button>
        <button type="button" className={`${btn} bg-amber-500 hover:bg-amber-600`} onClick={() => doAction('form|_|reset|demo-form')}>
          form|_|reset|demo-form
        </button>
        <button type="button" className={`${btn} bg-emerald-500 hover:bg-emerald-600`} onClick={() => { doAction('analytics|track', JSON.stringify({ event: 'cta' })); append('POSTed "analytics|track" → /_api/doAction'); }}>
          POST fallthrough
        </button>
      </div>

      {/* Targets the branches above act on. */}
      <div className="flex items-center gap-4 rounded-lg bg-white p-4 shadow">
        <button
          id="demo-target"
          type="button"
          onClick={() => append('#demo-target was clicked')}
          className="rounded border px-3 py-1.5 text-sm hover:bg-gray-100"
        >
          #demo-target
        </button>
        <form id="demo-form" className="flex items-center gap-2">
          <input
            type="text"
            defaultValue="type then reset me"
            className="rounded-md border border-gray-300 px-2 py-1 text-sm"
          />
          <span className="text-xs text-gray-400">#demo-form</span>
        </form>
      </div>

      <div className="rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
        <div className="mb-1 text-gray-400">log</div>
        {log.length === 0 ? (
          <div className="text-gray-500">Click an action above…</div>
        ) : (
          log.map((line, i) => <div key={i}>• {line}</div>)
        )}
      </div>
    </div>
  );
}

export default {
  title: 'Hooks/useDoActionHandler',
  component: UseDoActionDemo,
  decorators: [withPage()],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Interprets pipe-delimited "do action" strings: `window|…|trigger|id`, ' +
          '`window|…|click|id`, `form|…|reset|id`, and a fallthrough POST to ' +
          '`/_api/doAction` for anything else. Navigation branches exist too but ' +
          'are omitted here to keep the demo in place.',
      },
    },
  },
};

export const Default = {};
