import { $ } from 'bun';
import {type Context, Hono} from 'hono';
import {serveStatic} from 'hono/bun';

const app = new Hono();

// Serve static files from the public directory.
app.use('/*', serveStatic({root: './public'})); 

app.get('/playpause', async (c: Context) => {
  const output = await $`osascript -e 'tell application "Music" to playpause'`.text();
  return c.text("play/pause");
});

app.get('/nexttrack', async (c: Context) => {
  const output = await $`osascript -e 'tell application "Music" to play next track'`.text();
  return c.text("next track");
});

app.get('/prevtrack', async (c: Context) => {
  const output = await $`osascript -e 'tell application "Music" to play previous track'`.text();
  return c.text("prev track");
});

app.get('/repeat/:state', async (c: Context) => {
  const state = c.req.param('state');
  const output = await $`osascript -e '
  tell application "Music"
    set song repeat to ${state}
  end tell
  '`.text();
  return c.text(`repeat ${state}`);
});

export default {
  port: 8080,
  fetch: app.fetch, 
};