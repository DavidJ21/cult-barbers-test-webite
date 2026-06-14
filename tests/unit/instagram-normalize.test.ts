import { test } from "node:test";
import assert from "node:assert/strict";
import {
  safeHttpsUrl,
  normalizeBehold,
  normalizeGraph,
} from "../../src/lib/instagram-normalize.ts";

const FALLBACK = "https://www.instagram.com/cult.barber.studio/";

// ---- safeHttpsUrl ---------------------------------------------------------
test("safeHttpsUrl accepts https URLs", () => {
  assert.equal(
    safeHttpsUrl("https://scontent.cdninstagram.com/x.jpg"),
    "https://scontent.cdninstagram.com/x.jpg"
  );
});

test("safeHttpsUrl rejects non-https and dangerous schemes", () => {
  assert.equal(safeHttpsUrl("http://example.com/x.jpg"), null); // not https
  assert.equal(safeHttpsUrl("javascript:alert(1)"), null); // XSS payload
  assert.equal(safeHttpsUrl("data:text/html,<script>"), null);
  assert.equal(safeHttpsUrl("not a url"), null);
  assert.equal(safeHttpsUrl(""), null);
  assert.equal(safeHttpsUrl(undefined), null);
  assert.equal(safeHttpsUrl(123), null);
});

// ---- normalizeBehold ------------------------------------------------------
test("normalizeBehold parses the array form and prefers medium size", () => {
  const data = [
    {
      id: "1",
      permalink: "https://instagram.com/p/abc",
      mediaType: "IMAGE",
      prunedCaption: "Fresh fade",
      sizes: {
        small: { mediaUrl: "https://cdn/small.jpg" },
        medium: { mediaUrl: "https://cdn/medium.jpg" },
      },
    },
  ];
  const posts = normalizeBehold(data, FALLBACK, 8);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].imageUrl, "https://cdn/medium.jpg");
  assert.equal(posts[0].permalink, "https://instagram.com/p/abc");
  assert.equal(posts[0].caption, "Fresh fade");
  assert.equal(posts[0].isVideo, false);
});

test("normalizeBehold parses the { posts: [] } wrapper form", () => {
  const data = { posts: [{ id: "1", mediaUrl: "https://cdn/a.jpg" }] };
  assert.equal(normalizeBehold(data, FALLBACK, 8).length, 1);
});

test("normalizeBehold drops posts with no valid https image", () => {
  const data = [
    { id: "1", mediaUrl: "http://insecure/a.jpg" }, // http → dropped
    { id: "2" }, // no image → dropped
    { id: "3", mediaUrl: "https://cdn/ok.jpg" }, // kept
  ];
  const posts = normalizeBehold(data, FALLBACK, 8);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].id, "3");
});

test("normalizeBehold sanitises a javascript: permalink to the fallback", () => {
  const data = [
    {
      id: "1",
      permalink: "javascript:alert(document.cookie)",
      mediaUrl: "https://cdn/a.jpg",
    },
  ];
  const posts = normalizeBehold(data, FALLBACK, 8);
  assert.equal(posts[0].permalink, FALLBACK);
});

test("normalizeBehold respects the limit", () => {
  const data = Array.from({ length: 20 }, (_, i) => ({
    id: String(i),
    mediaUrl: `https://cdn/${i}.jpg`,
  }));
  assert.equal(normalizeBehold(data, FALLBACK, 8).length, 8);
});

test("normalizeBehold handles empty / malformed input", () => {
  assert.deepEqual(normalizeBehold([], FALLBACK, 8), []);
  assert.deepEqual(normalizeBehold(null, FALLBACK, 8), []);
  assert.deepEqual(normalizeBehold({}, FALLBACK, 8), []);
});

// ---- normalizeGraph -------------------------------------------------------
test("normalizeGraph maps images and uses thumbnail for video", () => {
  const data = {
    data: [
      {
        id: "1",
        media_type: "IMAGE",
        media_url: "https://cdn/img.jpg",
        permalink: "https://instagram.com/p/1",
        caption: "Cut",
      },
      {
        id: "2",
        media_type: "VIDEO",
        media_url: "https://cdn/video.mp4",
        thumbnail_url: "https://cdn/thumb.jpg",
        permalink: "https://instagram.com/p/2",
      },
    ],
  };
  const posts = normalizeGraph(data, FALLBACK, 8);
  assert.equal(posts.length, 2);
  assert.equal(posts[0].imageUrl, "https://cdn/img.jpg");
  assert.equal(posts[1].imageUrl, "https://cdn/thumb.jpg"); // video → thumbnail
  assert.equal(posts[1].isVideo, true);
});

test("normalizeGraph drops invalid images and sanitises permalink", () => {
  const data = {
    data: [
      { id: "1", media_type: "IMAGE", media_url: "ftp://nope/a.jpg" },
      {
        id: "2",
        media_type: "IMAGE",
        media_url: "https://cdn/a.jpg",
        permalink: "javascript:void(0)",
      },
    ],
  };
  const posts = normalizeGraph(data, FALLBACK, 8);
  assert.equal(posts.length, 1);
  assert.equal(posts[0].id, "2");
  assert.equal(posts[0].permalink, FALLBACK);
});
