<script>
  import slug from "slug";

  let urls = [];

  const getUrls = () => {
    chrome.runtime.sendMessage({ type: "getUrls" }, (response) => {
      if (response.urls.length) {
        urls = response.urls;
      }
    });
  };

  getUrls();
  setInterval(getUrls, 1000);
</script>

{#if urls.length}
  {#each urls as url}
    <div class="row">
      <a target="_blank" href={url} class="badge">
        {#if url.indexOf("mpd") !== -1}MPD{:else if url.indexOf("hls") !== -1}HLS{:else if url.indexOf("m3u8") !== -1}M3U8{:else if url.indexOf("mp4") !== -1}MP4{:else}Unknown{/if}
      </a>
      <button
        on:click={() => {
          chrome.tabs.query(
            { active: true, currentWindow: true },
            function (tabs) {
              var currTab = tabs[0];
              if (currTab) {
                // Sanity check
                const el = document.createElement("textarea");
                el.value = `youtube-dl "${url}" -o "${slug(
                  currTab.title
                )}.mp4"`;
                document.body.appendChild(el);
                el.select();
                document.execCommand("copy");
                document.body.removeChild(el);
              }
            }
          );
        }}>Copy youtube-dl</button
      >
    </div>
  {/each}
{:else}
  <p>No url's found</p>
{/if}

<div class="actions">
  <button
    class="small"
    on:click={() => {
      chrome.runtime.sendMessage({ type: "clearUrls" });
      urls = [];
    }}>Clear</button
  >
  <button
    class="small"
    on:click={() =>
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.update(tabs[0].id, { url: tabs[0].url });
      })}>Refresh page</button
  >
</div>

<style>
  :global(body) {
    background-color: #efefef;
    min-width: 250px;
    padding: 20px;
    overflow: auto;
    background: linear-gradient(to bottom, #aaffa9, #11ffbd);
    font-family: "Helvetica Neue", Helvetica, sans-serif;
  }

  .row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    color: white;
    background-color: red;
    border: 3px;
    text-decoration: none;
    display: inline;
    padding: 2px;
    border-radius: 5px;
  }

  button {
    font-weight: bold;
    background-color: white;
    text-transform: uppercase;
    text-align: center;
    padding: 4px 6px;
    font-size: 14px;
    border: 2px solid black;
    transition: all 0.1s;
  }

  button:hover {
    background-color: black;
    color: white;
  }

  button:active {
    transform: translateY(4px);
  }

  .actions {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .actions button:first-child {
    margin-right: 10px;
  }
</style>
