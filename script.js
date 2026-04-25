// DOM 元素
const questionInput = document.getElementById('question-input');
const askButton = document.getElementById('ask-button');
const answerOutput = document.getElementById('answer-output');
const businessType = document.getElementById('business-type');
const businessScale = document.getElementById('business-scale');
const generateReport = document.getElementById('generate-report');
const reportContent = document.getElementById('report-content');
const updatesList = document.getElementById('updates-list');
const emailInput = document.getElementById('email-input');
const subscribeButton = document.getElementById('subscribe-button');

// 初始化页面
function init() {
    // 加载政策更新列表
    loadUpdates();

    // 绑定事件
    bindEvents();
}

// 绑定事件
function bindEvents() {
    // AI 问答按钮点击事件
    askButton.addEventListener('click', function() {
        askAI();
    });

    // 生成自查报告按钮点击事件
    generateReport.addEventListener('click', function() {
        generateSelfCheckReport();
    });

    // 订阅按钮点击事件
    subscribeButton.addEventListener('click', function() {
        subscribeUpdates();
    });
}

// AI 问答功能
function askAI() {
    const question = questionInput.value.trim();
    if (!question) {
        answerOutput.innerHTML = '<p>请输入您的问题</p>';
        return;
    }

    // 显示 AI 正在思考
    answerOutput.innerHTML = '<p>AI 正在思考...</p>';

    // 调用豆包 API（火山引擎）
    fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ark-6c00de05-4616-42eb-b202-358f5bb04057-49af4' // 火山引擎 API 密钥
        },
        body: JSON.stringify({
            model: 'doubao-seed-2-0-mini-260215', // 模型 ID
            messages: [
                { role: 'system', content: '你是一个专业的金融合规顾问，专注于中国Fintech领域的合规问题。请针对以下问题提供专业、准确的回答，重点关注相关政策法规和监管要求。' },
                { role: 'user', content: question }
            ]
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.choices && data.choices[0] && data.choices[0].message) {
            const answer = data.choices[0].message.content;
            answerOutput.innerHTML = `<p>${answer}</p>`;
        } else if (data.error) {
            answerOutput.innerHTML = `<p>抱歉，AI 返回了错误：${data.error.message || '未知错误'}。请稍后再试。</p>`;
        } else {
            answerOutput.innerHTML = '<p>抱歉，AI 暂时无法回答这个问题。请稍后再试。</p>';
        }
    })
    .catch(error => {
        console.error('豆包 API 调用失败:', error);
        answerOutput.innerHTML = '<p>抱歉，AI 服务暂时不可用。请稍后再试。</p>';
    });
}

// 生成自查报告
function generateSelfCheckReport() {
    const type = businessType.value;
    const scale = businessScale.value;

    if (!type || !scale) {
        reportContent.innerHTML = '<p>请填写完整的业务信息</p>';
        return;
    }

    // 模拟生成报告过程
    reportContent.innerHTML = '<p>AI 正在生成报告...</p>';

    setTimeout(() => {
        // 获取业务类型文本
        const businessTypeText = {
            'mobile-payment': '移动支付',
            'consumer-finance': '消费金融',
            'anti-money-laundering': '反洗钱',
            'data-compliance': '数据合规'
        }[type] || type;

        let report = `
            <h4>自查报告</h4>
            <p><strong>业务类型：</strong>${businessTypeText}</p>
            <p><strong>业务规模：</strong>${getScaleText(scale)}</p>
            <h4>风险清单</h4>
            <ul>
        `;

        // 根据业务类型生成风险清单
        switch (type) {
            case 'mobile-payment':
                report += `
                    <li>支付业务许可证是否齐全</li>
                    <li>用户身份识别是否严格执行</li>
                    <li>交易安全保障措施是否到位</li>
                    <li>反洗钱措施是否符合要求</li>
                `;
                break;
            case 'consumer-finance':
                report += `
                    <li>消费金融公司牌照是否齐全</li>
                    <li>贷款利率是否符合规定</li>
                    <li>借款人资质审查是否严格</li>
                    <li>消费者权益保护是否到位</li>
                `;
                break;
            case 'anti-money-laundering':
                report += `
                    <li>反洗钱内部控制制度是否健全</li>
                    <li>客户身份识别是否严格执行</li>
                    <li>大额交易和可疑交易报告是否及时</li>
                    <li>反洗钱培训是否定期开展</li>
                `;
                break;
            case 'data-compliance':
                report += `
                    <li>个人信息收集是否获得用户同意</li>
                    <li>数据安全保护措施是否到位</li>
                    <li>数据跨境传输是否符合规定</li>
                    <li>数据安全评估是否定期开展</li>
                `;
                break;
        }

        report += `
            </ul>
            <h4>建议</h4>
            <p>根据您的业务情况，建议您：</p>
            <ol>
                <li>定期关注相关政策法规的更新</li>
                <li>建立健全内部合规管理体系</li>
                <li>加强员工合规培训</li>
                <li>定期开展合规自查</li>
            </ol>
        `;

        reportContent.innerHTML = report;
    }, 1000);
}

// 获取业务规模文本
function getScaleText(scale) {
    const scaleMap = {
        'startup': '初创企业',
        'small': '小型企业',
        'medium': '中型企业',
        'large': '大型企业'
    };
    return scaleMap[scale] || scale;
}

// 加载政策更新列表
function loadUpdates() {
    let html = '';

    policyUpdates.forEach(update => {
        html += `
            <div class="update-item">
                <h4>${update.title}</h4>
                <p>${update.content}</p>
                <div class="update-date">${update.date}</div>
            </div>
        `;
    });

    updatesList.innerHTML = html;
}

// 订阅更新提醒
function subscribeUpdates() {
    const email = emailInput.value.trim();

    if (!email) {
        alert('请输入您的邮箱地址');
        return;
    }

    // 模拟订阅过程
    alert('订阅成功！我们将定期向您发送政策更新提醒。');
    emailInput.value = '';
}

// 初始化页面
init();
