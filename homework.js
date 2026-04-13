// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
	const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;
	const response=await fetch(url);
	const data =await response.json();
	return data.products;
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	// 請實作此函式
	const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	const response=await fetch(url);
	const data =await response.json();
	const obj={};
	obj.carts=data.carts;
	obj.total=data.total;
	obj.finalTotal=data.finalTotal;
	return obj;
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 請實作此函式
	// 提示：
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
	try{
		const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`;
		const response=await fetch(url);
		const data =await response.json();
		if(response.ok){
			return {
				success:true,
				data:data.products
			};
		}else{
			return {
				success:false,
				error: '錯誤訊息'
			};
		};
	}catch(error){
		console.log("錯誤:",error.message);
	};
}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
	const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	let body={
			data:{
				"productId": productId,
				"quantity": quantity
			}
		};
	const response=await fetch(url,{
		method:"POST",
		headers: { 'Content-Type': 'application/json' },
		body:JSON.stringify(body)
	});
	const data =await response.json();
	return data;

}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
	const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	let body={
			data:{
				"id": cartId,
				"quantity": quantity
			}
		};
	const response=await fetch(url,{
		method:"PATCH",
		headers: { 'Content-Type': 'application/json' },
		body:JSON.stringify(body)
	});
	const data =await response.json();
	return data;
};

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts/{id}
	const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`;
	const response=await fetch(url,{
		method:"DELETE",
		headers: { 'Content-Type': 'application/json' }
	});
	const data =await response.json();
	return data;
};

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
	const url=`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`;
	const response=await fetch(url,{
		method:"DELETE",
		headers: { 'Content-Type': 'application/json' }
	});
	const data =await response.json();
	return data;
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
   1xx:資訊回應。例如:100表示請求已收到，繼續處理。
   2xx:成功回應。例如200表示請求已收到，並成功回應。
   3xx:重新導向訊息。例如304表示資源未修改，使用快取版本。
   4xx:用戶端錯誤回應(前端請求錯誤)。例如400表示可能有語法上的錯誤，導致伺服器無法處理。
   5xx:伺服器錯誤回應(後端請求錯誤)。例如500表示伺服器端發生未知或無法處理的錯誤。。

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
   以下皆是向伺服器提出請求，但動作有所不同:
   GET:「查詢資料」的動作。
   POST：「新增資料」的動作。
   PATCH：「修改資料」的動作，針對一筆資料的某幾筆欄位進行編輯、修改。
   PUT：「整份資料的修改」也就是Replace，針對一筆資料的「全部」欄位進行填寫。
   DELETE：「資料的刪除」，針對資料進行刪除。

3. 什麼是 RESTful API？
   答：就是用一個唯一的 URL 定位資源，將動作藏在 HTTP 的 method 裡面的一種撰寫API 的設計風格；
   特色是網址相同、方法不同，舉例如下:
   GET    /carts      
   POST   /carts      
   PATCH  /carts       
   DELETE /carts
   用不同HTTP 方法來表達動作，但網址統一。

*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
