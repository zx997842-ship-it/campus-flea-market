/* ============================================
   校园二手交易平台 · API Stubs
   签名即未来真实 API，内部返回 mock 数据
   ============================================ */

function delay(ms) {
  return new Promise(function(resolve) { setTimeout(resolve, ms); });
}

// GET /api/items?category=&keyword=&sort=&page=
// 返回: { code, data: { items, total, hasMore } }
async function fetchItems(opts) {
  opts = opts || {};
  var category = opts.category || "全部";
  var keyword = (opts.keyword || "").toLowerCase();
  var sort = opts.sort || "latest"; // latest | price-asc | price-desc
  var page = opts.page || 1;
  var pageSize = 10;

  await delay(500);

  var items = DB.items.slice();

  if (category && category !== "全部") {
    items = items.filter(function(i) { return i.category === category; });
  }
  if (keyword) {
    items = items.filter(function(i) {
      return i.title.toLowerCase().indexOf(keyword) !== -1 ||
             i.description.toLowerCase().indexOf(keyword) !== -1;
    });
  }

  if (sort === "price-asc") {
    items.sort(function(a, b) { return a.price - b.price; });
  } else if (sort === "price-desc") {
    items.sort(function(a, b) { return b.price - a.price; });
  }

  var start = (page - 1) * pageSize;
  var paged = items.slice(start, start + pageSize);

  return {
    code: 0,
    data: {
      items: paged,
      total: items.length,
      hasMore: start + pageSize < items.length,
    },
  };
}

// GET /api/items/:id
// 返回: { code, data: { item, seller, relatedItems } }
async function fetchItemDetail(id) {
  await delay(400);
  var item = getItem(id);
  if (!item) return { code: 404, data: null };
  var seller = getSeller(item.sellerId);
  var relatedItems = DB.items
    .filter(function(i) { return i.category === item.category && i.id !== item.id; })
    .slice(0, 4);
  return { code: 0, data: { item: item, seller: seller, relatedItems: relatedItems } };
}

// GET /api/messages
// 返回: { code, data: { conversations } }
async function fetchMessages() {
  await delay(400);
  return { code: 0, data: { conversations: DB.conversations } };
}

// GET /api/chat/:peerId
// 返回: { code, data: { messages, peer, item } }
async function fetchChat(peerId) {
  await delay(400);
  var conv = DB.conversations.find(function(c) { return c.peerId === peerId; });
  var messages = DB.chatHistory[peerId] || [];
  var peer = getSeller(peerId);
  var item = conv ? getItem(conv.itemId) : null;
  return {
    code: 0,
    data: {
      messages: messages,
      peer: peer,
      peerName: conv ? conv.peerName : peer.name,
      peerGradient: conv ? conv.peerGradient : peer.avatarGradient,
      peerText: conv ? conv.peerText : peer.avatarText,
      item: item,
    },
  };
}

// POST /api/items  body: { title, price, category, condition, description, images }
// 返回: { code, data: { id } }
async function publishItem(data) {
  await delay(800);
  // TODO: replace with fetch('/api/items', { method: 'POST', body: JSON.stringify(data) })
  var newId = Date.now();
  return { code: 0, data: { id: newId, success: true } };
}

// POST /api/items/:id/favorite  body: { favorited }
// 返回: { code, data: { favorited } }
async function toggleFavorite(itemId) {
  await delay(300);
  // TODO: replace with fetch('/api/items/' + itemId + '/favorite', { method: 'POST' })
  return { code: 0, data: { favorited: true } };
}

// GET /api/user/profile
// 返回: { code, data: { user, myItems, myFavorites } }
async function fetchUserProfile() {
  await delay(400);
  var myFavorites = DB.items.slice(0, 3);
  return {
    code: 0,
    data: {
      user: DB.currentUser,
      myItems: DB.myItems,
      myFavorites: myFavorites,
    },
  };
}

// POST /api/chat/:peerId  body: { text }
// 返回: { code, data: { message } }
async function sendMessage(peerId, text) {
  await delay(300);
  var msg = { id: Date.now(), fromMe: true, text: text, time: "刚刚" };
  return { code: 0, data: { message: msg } };
}

// Toast 工具
function showToast(text, duration) {
  duration = duration || 1800;
  var existing = document.querySelector('.toast');
  if (existing) existing.remove();
  var toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = text;
  document.body.appendChild(toast);
  requestAnimationFrame(function() { toast.classList.add('active'); });
  setTimeout(function() {
    toast.classList.remove('active');
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}
