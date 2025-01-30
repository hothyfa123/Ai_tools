const toolDetailsContainer = document.getElementById('tool-details');

// جلب الفهرس من الرابط
const urlParams = new URLSearchParams(window.location.search);
const toolIndex = urlParams.get('index'); // الحصول على الفهرس من الرابط

let tools = [];

// جلب الأدوات من الـ JSON
fetch('../font/Ai-tools.json')
    .then(response => response.json())
    .then(data => {
        tools = data;
        const tool = tools[toolIndex]; // الوصول إلى الأداة باستخدام الفهرس

        if (tool) {
            displayToolDetails(tool); // عرض تفاصيل الأداة
        } else {
            toolDetailsContainer.innerHTML = "<p>لم يتم العثور على الأداة.</p>";
        }
    })
    .catch(error => {
        console.error('Error loading tool data:', error);
        toolDetailsContainer.innerHTML = "<p>حدث خطأ في تحميل البيانات.</p>";
    });

// دالة لعرض تفاصيل الأداة
function displayToolDetails(tool) {
    toolDetailsContainer.innerHTML = `
        <div class="tool-detail">
            <img src="./images/${tool.Image_Url}" alt="${tool.Title}">
            <h2>${tool.Title}</h2>
            <p>${tool.Descripe}</p>
            <span class="category">${tool.Category}</span>
            <a href="${tool.Website_Url}" class="more-info">رابط الأداة</a>
        </div>
    `;
}
