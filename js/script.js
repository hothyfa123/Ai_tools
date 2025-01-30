const toolsUrl = '../font/Ai-tools.json';
const toolsContainer = document.getElementById("tools-container");

let tools = []; // قائمة الأدوات بعد جلبها من JSON
let loadedCount = 0; // عدد الأدوات المحملة حاليًا
const batchSize = 52; // عدد الأدوات التي يتم تحميلها في كل دفعة
let observer; // مراقب التمرير

// جلب الأدوات من JSON عند تحميل الصفحة
function loadTools() {
    fetch(toolsUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error loading tools: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            tools = data; // حفظ جميع الأدوات في المتغير
            toolsContainer.innerHTML = ""; // مسح أي محتوى سابق
            loadedCount = 0; // إعادة تعيين العداد
            loadMoreTools(); // تحميل أول دفعة
            setupObserver(); // إنشاء مراقب التمرير
        })
        .catch(error => console.error('Error loading tools:', error));
}

// تحميل دفعة جديدة من الأدوات
function loadMoreTools() {
    const nextBatch = tools.slice(loadedCount, loadedCount + batchSize); // استخراج الدُفعة الجديدة

    nextBatch.forEach(tool => addToolToDOM(tool)); // إضافة الأدوات إلى الصفحة

    loadedCount += nextBatch.length; // تحديث العداد

    if (loadedCount >= tools.length) {
        removeObserver(); // إزالة المراقب إذا تم تحميل جميع الأدوات
    } else {
        moveLoadTrigger(); // نقل المراقب إلى النهاية بعد كل تحميل
    }
}
// تحميل دفعة جديدة من الأدوات
function loadMoreTools() {
    const nextBatch = tools.slice(loadedCount, loadedCount + batchSize); // استخراج الدُفعة الجديدة

    nextBatch.forEach((tool, index) => addToolToDOM(tool, index)); // إضافة الأدوات إلى الصفحة مع الفهرس

    loadedCount += nextBatch.length; // تحديث العداد

    if (loadedCount >= tools.length) {
        removeObserver(); // إزالة المراقب إذا تم تحميل جميع الأدوات
    } else {
        moveLoadTrigger(); // نقل المراقب إلى النهاية بعد كل تحميل
    }
}

// إضافة أداة إلى DOM
function addToolToDOM(tool, index) {
    const toolElement = document.createElement("div");
    toolElement.classList.add("tool");

    const imageUrl = `./images/${tool.Image_Url}`;
    const imageSrcset = `./images/${tool.Image_Url} 1x, https://cdn.prod.website-files.com/63994dae1033718bee6949ce/${tool.Image_Url} 2x`;

    toolElement.innerHTML = `
        <img src="${imageUrl}" srcset="${imageSrcset}" 
        onerror="this.onerror=null; this.src='https://cdn.prod.website-files.com/63994dae1033718bee6949ce/${tool.Image_Url}';" 
        alt="${tool.Title}">
        <div class="tool-content">
            <h2>${tool.Title}</h2>
            <p>${tool.Descripe}</p>
            <span class="category">${tool.Category}</span>
            <div class="buttons">
            
            <a href="${tool.Website_Url}">رابط الأداة</a>
               
            </div>
        </div>
    `;
    toolsContainer.appendChild(toolElement);
}


// إنشاء وتحريك عنصر التحميل
function moveLoadTrigger() {
    let trigger = document.getElementById("load-more-trigger");

    if (!trigger) {
        trigger = document.createElement("div");
        trigger.id = "load-more-trigger";
        trigger.textContent = "جارٍ تحميل المزيد..."; // نص باللغة العربية
        trigger.style.cssText = `
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 50px;
            font-size: 18px;
            font-weight: bold;
            color: black;
            text-align: center;
        `;
        toolsContainer.appendChild(trigger);
    } else {
        toolsContainer.appendChild(trigger);
    }

    console.log("تم وضع مؤشر التحميل في المنتصف.");

    if (observer) {
        observer.observe(trigger);
    }
}

// إعداد مراقب التمرير
function setupObserver() {
    observer = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
            loadMoreTools(); // تحميل المزيد عند الوصول إلى النهاية
        }
    }, { rootMargin: "200px" });

    moveLoadTrigger(); // إنشاء وتحريك عنصر التحميل
}

// إزالة المراقب عندما لا يكون هناك المزيد للتحميل
function removeObserver() {
    if (observer) {
        observer.disconnect();
    }

    const trigger = document.getElementById("load-more-trigger");
    if (trigger) {
        trigger.remove();
    }
}

const searchInput = document.getElementById("search-input");
const tools_Container = document.getElementById("tools-container");

// دالة البحث
function filterTools() {
    showLoading(); // عرض رسالة التحميل
    const searchQuery = searchInput.value.trim().toLowerCase();

    setTimeout(() => {
        const filteredTools = tools.filter(tool => 
            tool.Title.toLowerCase().includes(searchQuery) || 
            tool.Descripe.toLowerCase().includes(searchQuery) || 
            tool.Category.toLowerCase().includes(searchQuery)
        );

        updateToolsDisplay(filteredTools);
    }, 500); // تأخير بسيط لمحاكاة تحميل البيانات
}

// دالة تصفية الأدوات حسب الفئة
function filterByCategory(category) {
    showLoading();
    setTimeout(() => {
        const filteredTools = category 
            ? tools.filter(tool => tool.Category === category)
            : tools;

        updateToolsDisplay(filteredTools);
    }, 500);
}

// دالة الفرز حسب الاسم أو الفئة
function sortTools(by, order = "asc") {
    showLoading();
    setTimeout(() => {
        tools.sort((a, b) => {
            let valA = a[by].toLowerCase();
            let valB = b[by].toLowerCase();

            return order === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        });

        updateToolsDisplay(tools);
    }, 500);
}

// دالة عرض رسالة التحميل
function showLoading() {
    tools_Container.innerHTML = "<p style='text-align:center; font-size:18px; color:#555;'>جارٍ تحميل البيانات...</p>";
}

// تحديث عرض الأدوات على الصفحة
function updateToolsDisplay(toolsList) {
    tools_Container.innerHTML = "";
    if (toolsList.length === 0) {
        tools_Container.innerHTML = "<p style='text-align:center; font-size:18px; color:#888;'>لم يتم العثور على نتائج</p>";
    } else {
        toolsList.forEach(tool => addToolToDOM(tool));
    }
}

// تحميل الأدوات عند فتح الصفحة
window.onload = loadTools;
