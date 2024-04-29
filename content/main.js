const replit_target = "467b585e";

function checkVersion() {
  const replit_version = window.SENTRY_RELEASE?.id;
  if (replit_version === undefined) {
    console.warn("REPLITEXAMLOCK:::", "No replit interface version found.");
  } else if (replit_version !== replit_target) {
    console.warn(
      "REPLITEXAMLOCK:::",
      `Replit interface version ${replit_version} does not match target of ${replit_target}`
    );
  } else {
    console.log(
      "REPLITEXAMLOCK:::",
      `Matching replit version found ${replit_version}`
    );
  }
}

function testMutation(mutation, node, test) {
  if (test.className && test.className !== node.className) {
    return false;
  }
  if (test.parent && test.parent != mutation.target.className) {
    return false;
  }
  if (test.query) {
    const matches = document.querySelectorAll(test.query);
    console.log("REPLITEXAMLOCK:::", test.query, matches);
    if (matches.length === 0) {
      console.warn(
        "REPLITEXAMLOCK:::",
        "No matches found for test query:",
        node,
        test.query
      );
      return false;
    } else if (matches.length > 1) {
      console.warn(
        "REPLITEXAMLOCK:::",
        "Ambigious test query. Multiple results found:",
        node,
        test.query
      );
      return false;
    } else if (matches[0] !== node) {
      console.warn(
        "REPLITEXAMLOCK:::",
        "Incorrect test query:",
        node,
        test.query
      );
      return false;
    }
  }
  return true;
}

function listener(mutations, observer) {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length) {
      const node = mutation.addedNodes[0];
      for (const test of nodesToRemove) {
        if (testMutation(mutation, node, test)) {
          console.log("REPLITEXAMLOCK:::", "Removing node");
          console.log("REPLITEXAMLOCK:::", mutation);
          console.log("REPLITEXAMLOCK:::", node);
          node.remove();
        }
      }
    }
  }
}

checkVersion();

const observer = new MutationObserver(listener);
observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
