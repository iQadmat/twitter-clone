import { tweetsData } from "./data.js";
import { v4 as uuidv4 } from "https://jspm.dev/uuid";

const tweetBtn = document.querySelector("#tweet-btn");
const tweetsContainer = document.querySelector("#feed");

tweetBtn.addEventListener("click", handleTweet);
tweetsContainer.addEventListener("click", handleTweetActions);

function handleTweet() {
  const tweetInput = document.querySelector("#tweet-input");
  if (tweetInput.value) {
    // Create a new tweet object.
    tweetsData.unshift({
      handle: `@ScrimbaTweetBot`,
      profilePic: `images/scrimbalogo.png`,
      likes: 0,
      retweets: 0,
      tweetText: tweetInput.value,
      replies: [],
      isLiked: false,
      isRetweeted: false,
      uuid: uuidv4(),
    });
  }

  tweetInput.value = "";
  renderHTML();
}

function handleTweetActions(e) {
  // Grab the tweet ID from the data attribute.
  e.target.dataset.reply ? handleReply(e.target.dataset.reply) : null;
  e.target.dataset.like ? handleLike(e.target.dataset.like) : null;
  e.target.dataset.retweet ? handleRetweet(e.target.dataset.retweet) : null;
}

function handleReply(tweetId) {
  // Get the tweet that was clicked.
  const targetTweet = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0];
  // Show/Hide replies.
  document.querySelector(`#replies-${tweetId}`).classList.toggle("hidden");
}

function handleLike(tweetId) {
  // Get the tweet that was clicked.
  const targetTweet = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0];
  // If the tweet is liked, unlike it, and vice versa. Update the likes count.
  targetTweet.isLiked = !targetTweet.isLiked;
  targetTweet.isLiked ? targetTweet.likes++ : targetTweet.likes--;
  renderHTML();
}

function handleRetweet(tweetId) {
  // Get the tweet that was clicked.
  const targetTweet = tweetsData.filter((tweet) => tweet.uuid === tweetId)[0];
  // If the tweet is retweeted, unretweet it, and vice versa. Update the retweets
  targetTweet.isRetweeted = !targetTweet.isRetweeted;
  targetTweet.isRetweeted ? targetTweet.retweets++ : targetTweet.retweets--;
  renderHTML();
}

function renderHTML() {
  tweetsContainer.innerHTML = generateHTML();
}

function generateHTML() {
  let tweetsHTML = "";
  let tweetRepliesHTML = "";
  let likeClass = "";
  let retweetClass = "";

  tweetsData.forEach((tweet) => {
    // If the tweet is liked or retweeted, add the appropriate class.
    tweet.isLiked ? (likeClass = "liked") : (likeClass = "");
    tweet.isRetweeted ? (retweetClass = "retweeted") : (retweetClass = "");

    // Check if the tweet has replies and generate the replies HTML.
    if (tweet.replies.length > 0) {
      tweet.replies.forEach((reply) => {
        tweetRepliesHTML += `
        <div class="tweet-reply">
          <div class="tweet-inner">
            <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
          </div>
        </div>`;
      });
    }

    // Generate the tweet HTML.
    tweetsHTML += `
    <div class="tweet">
      <div class="tweet-inner">
          <img src="${tweet.profilePic}" class="profile-pic">
          <div>
              <p class="handle">${tweet.handle}</p>
              <p class="tweet-text">${tweet.tweetText}</p>
              <div class="tweet-details">
                  <span class="tweet-detail">
                  <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                  ${tweet.replies.length}
                  </span>
                  <span class="tweet-detail">
                  <i class="fa-solid fa-heart ${likeClass}" data-like="${tweet.uuid}"></i>
                  ${tweet.likes}
                  </span>
                  <span class="tweet-detail">
                  <i class="fa-solid fa-retweet ${retweetClass}" data-retweet="${tweet.uuid}"></i>
                  ${tweet.retweets}
                  </span>
              </div>
          </div>
      </div>
      <div class="hidden" id="replies-${tweet.uuid}">
        ${tweetRepliesHTML}
      </div>
    </div>`;
  });
  return tweetsHTML;
}

renderHTML();
