// 1. 店家資料庫
const shopData = [
    {
        id: 1,
        name: "艋舺自助餐",
        type: "台式",
        price: 90,
        time: "校內約 3-6 分鐘",
        location: "校內 | 學生宿舍餐廳 1F",
        hours: "週一~五 11:00-13:30, 16:30-19:00",
        img: "images/shop1.jpg",
        desc: "菜色選擇豐富，價格親民，北科學生每日省錢首選。",
        pinPos: { top: "35%", left: "30%" }
    },
    {
        id: 2,
        name: "直火盒子",
        type: "台式",
        price: 130,
        time: "校內約 5-8 分鐘",
        location: "校內 | 學生宿舍餐廳 1F",
        hours: "週一~五 11:00-13:30, 17:00-19:00",
        img: "images/shop2.jpg",
        desc: "現點現做直火炙燒便當，肉質多汁香氣濃郁。",
        pinPos: { top: "55%", left: "45%" }
    },
    {
        id: 3,
        name: "辛巴美食",
        type: "越式",
        price: 110,
        time: "校內約 4-7 分鐘",
        location: "校內 | 光華館二期餐廳 1F",
        hours: "週一~六 10:00-19:00",
        img: "images/shop3.jpg",
        desc: "道地越式河粉與麵食，湯頭清爽解膩。",
        pinPos: { top: "40%", left: "65%" }
    },
    {
        id: 4,
        name: "日光料理",
        type: "日式",
        price: 160,
        time: "校內約 3-6 分鐘",
        location: "校內 | 光華館綠光庭園餐廳 2F",
        hours: "週一~五 11:00-19:00",
        img: "images/shop4.jpg",
        desc: "溫馨日式定食與勝丼，內用提供免費熱湯。",
        pinPos: { top: "70%", left: "75%" }
    }
];

// 2. 全局變數
let favorites = [];
let mode = "filter"; 
let currentFilterType = "全部";
let currentMaxBudget = 200;
let quickSelectedIds = [1, 2, 3, 4];

// 3. 頁面切換控制 (SPA)
function switchPage(pageId, navElement) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    if (navElement) {
        document.querySelectorAll('.nav-item').forEach(btn => btn.classList.remove('active'));
        navElement.classList.add('active');
    }

    window.scrollTo(0, 0);
}

// 4. 點擊底部「搜尋推薦」
function openSearchPage(navElement) {
    mode = "filter";
    document.getElementById('filterCardSection').style.display = "block"; 
    document.getElementById('categoryTitle').innerText = "🎯 全部推薦店家";
    
    // 重設為全部
    currentFilterType = "全部";
    currentMaxBudget = 200;
    const rangeInput = document.getElementById('budgetRange');
    if(rangeInput) rangeInput.value = 200;
    document.getElementById('budgetValue').innerText = "NT$ 200 以內";
    
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    const allTag = document.querySelector('.tag');
    if(allTag) allTag.classList.add('active');

    renderShops();
    switchPage('page2', navElement);
}

// 5. 點擊首頁「快速需求分類」
function selectQuickCategory(category) {
    mode = "quick";
    document.getElementById('filterCardSection').style.display = "none"; 
    const titleEl = document.getElementById('categoryTitle');

    if (category === '便當') {
        quickSelectedIds = [1];
        titleEl.innerText = "🍱 快速省錢便當推薦";
    } else if (category === '拉麵') {
        quickSelectedIds = [3];
        titleEl.innerText = "🍜 熱呼呼拉麵湯麵推薦";
    } else if (category === '聚餐') {
        quickSelectedIds = [4];
        titleEl.innerText = "🎉 三五好友聚餐推薦";
    } else if (category === '日式') {
        quickSelectedIds = [2];
        titleEl.innerText = "🍱 秘密日式定食推薦";
    }

    renderShops();
    switchPage('page2');
}

// 6. 篩選面板連動
function updateBudget(val) {
    currentMaxBudget = parseInt(val);
    document.getElementById('budgetValue').innerText = `NT$ ${val} 以內`;
    renderShops();
}

function toggleTag(element, typeName) {
    document.querySelectorAll('.tag').forEach(t => t.classList.remove('active'));
    element.classList.add('active');
    currentFilterType = typeName;
    renderShops();
}

// 7. 抽籤邏輯
let isSpinning = false;
function spinWheel() {
    if (isSpinning) return;
    isSpinning = true;

    const mainText = document.getElementById('wheelMainText');
    const subText = document.getElementById('wheelSubText');
    const resultText = document.getElementById('spinResult');

    mainText.innerText = "抽取中...";
    subText.innerText = "命運轉盤旋轉中";
    resultText.innerText = "";

    let count = 0;
    const interval = setInterval(() => {
        const tempShop = shopData[Math.floor(Math.random() * shopData.length)];
        mainText.innerText = tempShop.name;
        count++;

        if (count > 15) {
            clearInterval(interval);
            const finalShop = shopData[Math.floor(Math.random() * shopData.length)];
            mainText.innerText = finalShop.name;
            subText.innerText = `NT$ ${finalShop.price} | ${finalShop.type}`;
            resultText.innerText = `🎉 今天就決定吃：${finalShop.name}！`;
            isSpinning = false;
        }
    }, 100);
}

// 8. 渲染店家清單與地圖 Pin
function renderShops() {
    const listContainer = document.getElementById('shopList');
    const pinsContainer = document.getElementById('mapPins');
    
    let filteredShops = [];

    if (mode === "filter") {
        filteredShops = shopData.filter(shop => {
            const typeMatch = (currentFilterType === "全部") || (shop.type === currentFilterType);
            const priceMatch = shop.price <= currentMaxBudget;
            return typeMatch && priceMatch;
        });
    } else {
        filteredShops = shopData.filter(shop => quickSelectedIds.includes(shop.id));
    }

    if (filteredShops.length === 0) {
        listContainer.innerHTML = `<p style="text-align:center; color:#888; margin-top: 20px;">沒有找到符合條件的店家喔！</p>`;
        pinsContainer.innerHTML = "";
        return;
    }

    listContainer.innerHTML = filteredShops.map(shop => {
        const isFav = favorites.includes(shop.id);
        return `
            <div class="shop-card">
                <img src="${shop.img}" class="shop-img" alt="${shop.name}">
                <div class="shop-info" onclick="openDetail(${shop.id})">
                    <div class="shop-title">${shop.name}</div>
                    <div class="shop-meta">💰 NT$ ${shop.price} | 🚶 ${shop.time}</div>
                    <div class="shop-tags">
                        <span class="shop-tag-mini">${shop.type}</span>
                        <span class="shop-tag-mini">${shop.location.split('|')[0]}</span>
                    </div>
                </div>
                <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart fav-btn ${isFav ? 'active' : ''}" 
                   onclick="toggleFavorite(${shop.id})"></i>
            </div>
        `;
    }).join('');

    pinsContainer.innerHTML = filteredShops.map(shop => `
        <div class="map-pin" 
             style="top: ${shop.pinPos.top}; left: ${shop.pinPos.left};" 
             onclick="openDetail(${shop.id})">
             📍 ${shop.name}
        </div>
    `).join('');
}

// 9. 開啟店家詳細頁面
function openDetail(shopId) {
    const shop = shopData.find(s => s.id === shopId);
    if (!shop) return;

    const detailContainer = document.getElementById('shopDetailContent');
    const isFav = favorites.includes(shop.id);

    detailContainer.innerHTML = `
        <img src="${shop.img}" class="detail-img" alt="${shop.name}">
        <h2>${shop.name}</h2>
        <p style="color:#F1A653; font-size: 1.1rem; margin: 8px 0; font-weight:bold;">約 NT$ ${shop.price} / 人</p>
        <p style="color:#aaa; margin-bottom: 8px; font-size: 0.85rem;"><i class="fa-solid fa-location-dot"></i> ${shop.location}</p>
        <p style="color:#aaa; margin-bottom: 12px; font-size: 0.85rem;"><i class="fa-solid fa-clock"></i> ${shop.hours}</p>
        <hr style="border: none; border-top: 1px solid #2F3136; margin: 12px 0;">
        <h3 style="font-size: 0.95rem; margin-bottom: 6px;">店家簡介</h3>
        <p style="line-height: 1.6; color:#ccc; font-size: 0.85rem;">${shop.desc}</p>
        <button class="btn-primary-lg" style="width:100%; margin-top: 20px;" onclick="toggleFavorite(${shop.id})">
            ${isFav ? '❤️ 已從收藏移除' : '🤍 加入我的收藏'}
        </button>
    `;

    switchPage('page3');
}

// 10. 收藏管理
function toggleFavorite(shopId) {
    const index = favorites.indexOf(shopId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(shopId);
    }
    
    document.getElementById('favCount').innerText = favorites.length;
    renderShops();
    renderFavorites();

    const activeSection = document.querySelector('.page-section.active');
    if (activeSection && activeSection.id === 'page3') {
        openDetail(shopId);
    }
}

function renderFavorites() {
    const favContainer = document.getElementById('favList');
    const favShops = shopData.filter(s => favorites.includes(s.id));

    if (favShops.length === 0) {
        favContainer.innerHTML = `<p style="text-align:center; color:#888; margin-top: 40px;">目前還沒有收藏任何店家喔！</p>`;
        return;
    }

    favContainer.innerHTML = favShops.map(shop => `
        <div class="shop-card">
            <img src="${shop.img}" class="shop-img" alt="${shop.name}">
            <div class="shop-info" onclick="openDetail(${shop.id})">
                <div class="shop-title">${shop.name}</div>
                <div class="shop-meta">💰 NT$ ${shop.price} | 🚶 ${shop.time}</div>
            </div>
            <i class="fa-solid fa-heart fav-btn active" onclick="toggleFavorite(${shop.id})"></i>
        </div>
    `).join('');
}

// 初始化
document.addEventListener("DOMContentLoaded", () => {
    renderShops();
});