(function () {
  'use strict';

  // 悬浮球按钮
  const fab = document.createElement('button');
  fab.id = 'wechat-plugin-btn';
  fab.textContent = '💬';
  document.body.appendChild(fab);

  // 主覆盖层
  const overlay = document.createElement('div');
  overlay.id = 'wechat-overlay';
  overlay.innerHTML = `
    <div class="wechat-topbar">
      <button class="wechat-back" id="wechat-back">‹</button>
      <span id="wechat-title">微信</span>
    </div>
    <div class="wechat-page active" id="page-friends">
      <div class="friend-list" id="friend-list"></div>
    </div>
    <div class="wechat-page" id="page-chat">
      <div class="chat-messages" id="chat-messages"></div>
      <div class="chat-inputbar">
        <input class="chat-input" id="chat-input" placeholder="发送消息…" />
        <button class="chat-send-btn" id="chat-send">发送</button>
        <button class="chat-call-btn" id="chat-call">📞</button>
      </div>
    </div>
    <div class="wechat-page" id="page-settings">
      <div class="settings-page">设置面板（开发中）</div>
    </div>
  `;
  document.body.appendChild(overlay);

  // 打开/关闭
  fab.addEventListener('click', () => overlay.classList.toggle('open'));

  // 返回逻辑
  document.getElementById('wechat-back').addEventListener('click', () => {
    const pages = overlay.querySelectorAll('.wechat-page');
    pages.forEach(p => p.classList.remove('active'));
    document.getElementById('page-friends').classList.add('active');
    document.getElementById('wechat-title').textContent = '微信';
  });
  // 好友列表渲染
  function renderFriends() {
    const list = document.getElementById('friend-list');
    list.innerHTML = '';
    const chars = SillyTavern.getContext().characters || [];
    chars.forEach((char, idx) => {
      const item = document.createElement('div');
      item.className = 'friend-item';
      const img = document.createElement('img');
      img.className = 'friend-avatar';
      img.src = char.avatar ? `/characters/${char.avatar}` : '';
      img.onerror = () => { img.style.background = '#07c160'; };
      const name = document.createElement('span');
      name.className = 'friend-name';
      name.textContent = char.name;
      item.appendChild(img);
      item.appendChild(name);
      item.addEventListener('click', () => openChat(char, idx));
      list.appendChild(item);
    });
  }

  // 打开聊天页
  function openChat(char, idx) {
    document.getElementById('wechat-title').textContent = char.name;
    document.querySelectorAll('.wechat-page').forEach(p => p.classList.remove('active'));
    document.getElementById('page-chat').classList.add('active');
    document.getElementById('chat-messages').innerHTML = '';
    document.getElementById('chat-send').onclick = () => {
      const input = document.getElementById('chat-input');
      const text = input.value.trim();
      if (!text) return;
      addBubble(text, 'right');
      input.value = '';
    };
    document.getElementById('chat-call').onclick = () => {
      alert('通话功能开发中');
    };
  }

  // 添加气泡
  function addBubble(text, side) {
    const box = document.getElementById('chat-messages');
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${side}`;
    bubble.textContent = text;
    box.appendChild(bubble);
    box.scrollTop = box.scrollHeight;
  }

  // 初始化
  overlay.addEventListener('transitionend', renderFriends);
  fab.addEventListener('click', () => {
    if (overlay.classList.contains('open')) renderFriends();
  });

})();
