import {
    defaultSender,
    defaultRecipient,
    defaultProduct,
    dgCategories,
    dgPackageTypes,
    dgPackingGroups,
    dgUnits,
    dgTemplates
} from './data.js';

// --- State ---
let state = {
    reference: `S${Math.floor(Date.now() / 1000)}`,
    reference2: "",
    realtimeRef: true,
    appendCountries: true,
    senderJson: JSON.stringify(defaultSender, null, 2),
    recipientJson: JSON.stringify(defaultRecipient, null, 2),
    includeProducts: true,
    showAddresses: true,
    products: [JSON.parse(JSON.stringify(defaultProduct))],
    shipmentDetail: {
        weight: "2.6",
        parcels: "1",
        value: "12.5",
        rules_metadata: ""
    }
};

// --- DOM Elements ---
let els = {};

// --- Initialization ---
function init() {
    els = {
        ref1: document.getElementById('ref1'),
        ref2: document.getElementById('ref2'),
        realtimeRef: document.getElementById('realtime-ref'),
        appendCountries: document.getElementById('append-countries'),
        senderJson: document.getElementById('sender-json'),
        recipientJson: document.getElementById('recipient-json'),
        shipWeight: document.getElementById('ship-weight'),
        shipParcels: document.getElementById('ship-parcels'),
        shipValue: document.getElementById('ship-value'),
        shipMetadata: document.getElementById('ship-metadata'),
        includeProducts: document.getElementById('include-products'),
        productsContainer: document.getElementById('products-container'),
        payloadPreview: document.getElementById('payload-preview'),
        copyBtn: document.getElementById('copy-btn'),
        copyText: document.getElementById('copy-text'),
        syncBtn: document.getElementById('sync-btn'),
        syncBanner: document.getElementById('sync-banner'),
        showAddresses: document.getElementById('show-addresses'),
        addressesPanel: document.getElementById('addresses-panel')
    };

    // Load from LocalStorage
    const savedRealtime = localStorage.getItem('shiptheory_realtime');
    const savedRef1 = localStorage.getItem('shiptheory_ref1');
    const savedRef2 = localStorage.getItem('shiptheory_ref2');

    if (savedRealtime !== null) {
        state.realtimeRef = savedRealtime === 'true';
    }
    if (!state.realtimeRef && savedRef1 !== null) {
        state.reference = savedRef1;
    }
    if (savedRef2 !== null) {
        state.reference2 = savedRef2;
    }

    els.ref1.value = state.reference;
    els.ref2.value = state.reference2;
    els.realtimeRef.checked = state.realtimeRef;
    els.appendCountries.checked = state.appendCountries;
    els.showAddresses.checked = state.showAddresses;
    els.includeProducts.checked = state.includeProducts;
    els.senderJson.value = state.senderJson;
    els.recipientJson.value = state.recipientJson;
    els.shipWeight.value = state.shipmentDetail.weight;
    els.shipParcels.value = state.shipmentDetail.parcels;
    els.shipValue.value = state.shipmentDetail.value;
    els.shipMetadata.value = state.shipmentDetail.rules_metadata;

    // Sync visibility
    els.addressesPanel.style.display = state.showAddresses ? 'grid' : 'none';
    els.productsContainer.style.display = state.includeProducts ? 'block' : 'none';
    els.syncBtn.style.display = state.includeProducts ? 'flex' : 'none';

    attachListeners();
    renderProducts();
    updatePayload();

    // Check if lucide is available (it's loaded via script tag in HTML)
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Start Real-time Ref interval
    setInterval(() => {
        if (state.realtimeRef) {
            state.reference = `S${Math.floor(Date.now() / 1000)}`;
            els.ref1.value = state.reference;
            updatePayload();
        }
    }, 1000);
}

function attachListeners() {
    const updateState = (key, subkey, val) => {
        if (subkey) state[key][subkey] = val;
        else state[key] = val;
        updatePayload();
    };

    els.ref1.addEventListener('input', (e) => {
        state.realtimeRef = false;
        els.realtimeRef.checked = false;
        localStorage.setItem('shiptheory_realtime', 'false');
        localStorage.setItem('shiptheory_ref1', e.target.value);
        updateState('reference', null, e.target.value);
    });
    els.ref2.addEventListener('input', (e) => {
        localStorage.setItem('shiptheory_ref2', e.target.value);
        updateState('reference2', null, e.target.value);
    });
    els.realtimeRef.addEventListener('change', (e) => {
        state.realtimeRef = e.target.checked;
        localStorage.setItem('shiptheory_realtime', state.realtimeRef);
        if (state.realtimeRef) {
            state.reference = `S${Math.floor(Date.now() / 1000)}`;
            els.ref1.value = state.reference;
            updatePayload();
        } else {
            localStorage.setItem('shiptheory_ref1', state.reference);
        }
    });
    els.appendCountries.addEventListener('change', (e) => {
        state.appendCountries = e.target.checked;
        updatePayload();
    });
    els.senderJson.addEventListener('input', (e) => updateState('senderJson', null, e.target.value));
    els.recipientJson.addEventListener('input', (e) => updateState('recipientJson', null, e.target.value));

    els.shipWeight.addEventListener('input', (e) => updateState('shipmentDetail', 'weight', e.target.value));
    els.shipParcels.addEventListener('input', (e) => updateState('shipmentDetail', 'parcels', e.target.value));
    els.shipValue.addEventListener('input', (e) => updateState('shipmentDetail', 'value', e.target.value));
    els.shipMetadata.addEventListener('input', (e) => updateState('shipmentDetail', 'rules_metadata', e.target.value));

    els.includeProducts.addEventListener('change', (e) => {
        state.includeProducts = e.target.checked;
        els.productsContainer.style.display = e.target.checked ? 'block' : 'none';
        els.syncBtn.style.display = e.target.checked ? 'flex' : 'none';
        updatePayload();
    });

    els.showAddresses.addEventListener('change', (e) => {
        state.showAddresses = e.target.checked;
        els.addressesPanel.style.display = e.target.checked ? 'grid' : 'none';
    });

    els.payloadPreview.addEventListener('input', () => {
        els.syncBanner.classList.remove('hidden');
    });
}

// --- Helpers Exposed to Window ---
export function generateRef1() {
    state.realtimeRef = false;
    els.realtimeRef.checked = false;
    localStorage.setItem('shiptheory_realtime', 'false');
    state.reference = `S${Math.floor(Date.now() / 1000)}`;
    localStorage.setItem('shiptheory_ref1', state.reference);
    els.ref1.value = state.reference;
    updatePayload();
}

export function syncFromProducts() {
    const totalWeight = state.products.reduce((sum, p) => sum + (parseFloat(p.weight) || 0) * (parseInt(p.qty) || 0), 0);
    const totalValue = state.products.reduce((sum, p) => sum + (parseFloat(p.value) || 0) * (parseInt(p.qty) || 0), 0);

    state.shipmentDetail.weight = totalWeight.toString();
    state.shipmentDetail.value = totalValue.toString();

    els.shipWeight.value = state.shipmentDetail.weight;
    els.shipValue.value = state.shipmentDetail.value;

    updatePayload();
}

export function addProduct() {
    state.products.push(JSON.parse(JSON.stringify(defaultProduct)));
    state.products[state.products.length - 1].sku = `SKU-00${state.products.length}`;
    renderProducts();
    updatePayload();
}

export function removeProduct(index) {
    state.products.splice(index, 1);
    renderProducts();
    updatePayload();
}

export function updateProductField(index, field, value, subfield) {
    if (field === 'sku' && typeof value === 'string') {
        value = value.toUpperCase();
    }
    if (subfield) {
        state.products[index][field][subfield] = value;
    } else {
        state.products[index][field] = value;
    }
    updatePayload();
}

export function applyDGTemplate(idx, templateIdx) {
    if (templateIdx === "") return;
    const template = dgTemplates[templateIdx];
    const product = state.products[idx];

    product.includeDG = true;
    product.includeCommodity = true;

    product.dgDetails.category = template.category;
    product.dgDetails.un_number = template.un_number;
    product.dgDetails.amount = template.amount;
    product.dgDetails.unit = template.unit;
    product.dgDetails.package_type = template.package_type;

    product.commodityDetails.commodity_code = template.commodity_code;
    product.commodityDetails.commodity_description = template.commodity_description;

    renderProducts();
    updatePayload();
}

export function renderProducts() {
    els.productsContainer.innerHTML = '';
    state.products.forEach((product, idx) => {
        const div = document.createElement('div');
        div.className = 'p-5 border border-slate-100 bg-slate-50 rounded-xl relative group transition-all hover:bg-white hover:shadow-md';
        div.innerHTML = `
            <button onclick="removeProduct(${idx})" class="absolute top-4 right-4 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all">
                <i data-lucide="trash-2" class="w-4 h-4"></i>
            </button>

            <div class="grid grid-cols-2 md:grid-cols-5 gap-4 pr-10 mb-5">
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">SKU</label>
                    <input class="w-full text-sm p-2 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500 uppercase" value="${product.sku}" oninput="this.value = this.value.toUpperCase(); updateProductField(${idx}, 'sku', this.value)">
                </div>
                <div class="col-span-2 md:col-span-1">
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Name</label>
                    <input class="w-full text-sm p-2 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500" value="${product.name}" oninput="updateProductField(${idx}, 'name', this.value)">
                </div>
                <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Qty</label>
                    <input type="number" class="w-full text-sm p-2 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500" value="${product.qty}" oninput="updateProductField(${idx}, 'qty', this.value)">
                </div>
                <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Weight</label>
                    <input type="number" step="0.1" class="w-full text-sm p-2 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500" value="${product.weight}" oninput="updateProductField(${idx}, 'weight', this.value)">
                </div>
                <div>
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1">Value</label>
                    <input type="number" step="0.1" class="w-full text-sm p-2 border border-slate-200 rounded outline-none focus:ring-2 focus:ring-blue-500" value="${product.value}" oninput="updateProductField(${idx}, 'value', this.value)">
                </div>
            </div>

            <div class="border-t border-slate-200 pt-4 mt-4">
                <div class="mb-4">
                    <label class="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
                        <i data-lucide="zap" class="w-3 h-3 text-amber-500"></i>
                        Quick Templates
                    </label>
                    <select class="w-full text-xs p-2 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-amber-500 bg-amber-50/30" onchange="applyDGTemplate(${idx}, this.value)">
                        <option value="">-- Apply a Dangerous Goods Template --</option>
                        ${dgTemplates.map((t, i) => `<option value="${i}">${t.name}</option>`).join('')}
                    </select>
                </div>

                <div class="flex items-center justify-between mb-3">
                    <label for="dg-toggle-${idx}" class="flex items-center gap-2 text-amber-600 font-semibold text-xs tracking-wider uppercase cursor-pointer select-none">
                        <i data-lucide="alert-triangle" class="w-4 h-4"></i>
                        <span>Dangerous Goods Details</span>
                    </label>
                    <label class="relative inline-flex items-center cursor-pointer select-none">
                        <input id="dg-toggle-${idx}" type="checkbox" class="sr-only toggle-dg" ${product.includeDG ? 'checked' : ''} onchange="toggleProductDG(${idx}, this.checked)">
                        <div class="toggle-label-dg w-9 h-5 bg-slate-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                        <span class="ml-2 text-[10px] font-medium text-slate-500">Enable</span>
                    </label>
                </div>

                <div id="dg-fields-${idx}" class="${product.includeDG ? '' : 'hidden'} grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-amber-50 rounded-lg border border-amber-100">
                        <div class="col-span-2">
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">Category</label>
                        <select class="w-full text-xs p-2 border border-amber-200 rounded outline-none bg-white focus:ring-2 focus:ring-amber-500" onchange="updateProductField(${idx}, 'dgDetails', this.value, 'category')">
                            <option value=""></option>
                            ${dgCategories.map(c => `<option value="${c.code}" ${product.dgDetails.category === c.code ? 'selected' : ''}>${c.name}</option>`).join('')}
                        </select>
                    </div>
                    <div class="col-span-2 md:col-span-1">
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">Package Type</label>
                        <select class="w-full text-xs p-2 border border-amber-200 rounded outline-none bg-white focus:ring-2 focus:ring-amber-500" onchange="updateProductField(${idx}, 'dgDetails', this.value, 'package_type')">
                            <option value=""></option>
                            ${dgPackageTypes.map(p => `<option value="${p.code}" ${product.dgDetails.package_type === p.code ? 'selected' : ''}>${p.name}</option>`).join('')}
                        </select>
                    </div>
                        <div>
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">UN Number</label>
                        <input class="w-full text-xs p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none" value="${product.dgDetails.un_number}" oninput="updateProductField(${idx}, 'dgDetails', this.value, 'un_number')">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">Packing Group</label>
                        <select class="w-full text-xs p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white" onchange="updateProductField(${idx}, 'dgDetails', this.value, 'packing_group')">
                            <option value=""></option>
                            ${dgPackingGroups.map(pg => `<option value="${pg.code}" ${product.dgDetails.packing_group === pg.code ? 'selected' : ''}>${pg.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">Amount</label>
                        <input type="number" step="0.001" class="w-full text-xs p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none" value="${product.dgDetails.amount}" oninput="updateProductField(${idx}, 'dgDetails', this.value, 'amount')">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">Unit</label>
                        <select class="w-full text-xs p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white" onchange="updateProductField(${idx}, 'dgDetails', this.value, 'unit')">
                            ${dgUnits.map(u => `<option value="${u.code}" ${product.dgDetails.unit === u.code ? 'selected' : ''}>${u.name}</option>`).join('')}
                        </select>
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-amber-700 mb-1">IATA Accessible</label>
                        <select class="w-full text-xs p-2 border border-amber-200 rounded focus:ring-2 focus:ring-amber-500 outline-none bg-white" onchange="updateProductField(${idx}, 'dgDetails', this.value, 'is_accessible')">
                            <option value="" ${product.dgDetails.is_accessible === "" ? 'selected' : ''}></option>
                            <option value="true" ${product.dgDetails.is_accessible === "true" || product.dgDetails.is_accessible === true ? 'selected' : ''}>True</option>
                            <option value="false" ${product.dgDetails.is_accessible === "false" || product.dgDetails.is_accessible === false ? 'selected' : ''}>False</option>
                        </select>
                    </div>
                    </div>
                </div>
            </div>

            <div class="border-t border-slate-200 pt-4 mt-4">
                <div class="flex items-center justify-between mb-3">
                    <label for="comm-toggle-${idx}" class="flex items-center gap-2 text-blue-600 font-semibold text-xs tracking-wider uppercase cursor-pointer select-none">
                        <i data-lucide="scroll-text" class="w-4 h-4"></i>
                        <span>Commodity Details</span>
                    </label>
                    <div class="flex items-center gap-4">
                        <button onclick="copyCommodityToAll(${idx})" class="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors bg-slate-100 px-2 py-1 rounded" title="Copy these commodity details to all other products">
                            <i data-lucide="copy" class="w-3 h-3"></i>
                            Copy to All
                        </button>
                        <label class="relative inline-flex items-center cursor-pointer select-none">
                            <input id="comm-toggle-${idx}" type="checkbox" class="sr-only toggle-commodity" ${product.includeCommodity ? 'checked' : ''} onchange="toggleProductCommodity(${idx}, this.checked)">
                            <div class="toggle-label-commodity w-9 h-5 bg-slate-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                            <span class="ml-2 text-[10px] font-medium text-slate-500">Enable</span>
                        </label>
                    </div>
                </div>

                <div id="commodity-fields-${idx}" class="${product.includeCommodity ? '' : 'hidden'} grid grid-cols-2 gap-3 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                        <div>
                        <label class="block text-[10px] font-bold text-blue-700 mb-1">Commodity Code</label>
                        <input class="w-full text-xs p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none" value="${product.commodityDetails.commodity_code}" oninput="updateProductField(${idx}, 'commodityDetails', this.value, 'commodity_code')">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-blue-700 mb-1">Country of Manufacture</label>
                        <input class="w-full text-xs p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none" value="${product.commodityDetails.commodity_manucountry}" oninput="updateProductField(${idx}, 'commodityDetails', this.value, 'commodity_manucountry')">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-blue-700 mb-1">Composition</label>
                        <input class="w-full text-xs p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none" value="${product.commodityDetails.commodity_composition}" oninput="updateProductField(${idx}, 'commodityDetails', this.value, 'commodity_composition')">
                    </div>
                    <div>
                        <label class="block text-[10px] font-bold text-blue-700 mb-1">Description</label>
                        <input class="w-full text-xs p-2 border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 outline-none" value="${product.commodityDetails.commodity_description}" oninput="updateProductField(${idx}, 'commodityDetails', this.value, 'commodity_description')">
                    </div>
                </div>
            </div>
        `;
        els.productsContainer.appendChild(div);
    });
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

export function toggleProductDG(idx, checked) {
    state.products[idx].includeDG = checked;
    const container = document.getElementById(`dg-fields-${idx}`);
    if (container) {
        container.classList.toggle('hidden', !checked);
    }
    updatePayload();
}

export function toggleProductCommodity(idx, checked) {
    state.products[idx].includeCommodity = checked;
    const container = document.getElementById(`commodity-fields-${idx}`);
    if (container) {
        container.classList.toggle('hidden', !checked);
    }
    updatePayload();
}

export function copyCommodityToAll(idx) {
    const source = state.products[idx].commodityDetails;
    const isEnabled = state.products[idx].includeCommodity;
    state.products.forEach(p => {
        p.commodityDetails = { ...source };
        p.includeCommodity = isEnabled;
    });
    renderProducts();
    updatePayload();
}

function cleanObject(obj, numFields = [], boolFields = []) {
    const cleaned = {};
    Object.keys(obj).forEach(key => {
        const val = obj[key];
        if (val !== undefined && val !== null && val !== '') {
            if (numFields.includes(key)) {
                const parsed = parseFloat(val);
                cleaned[key] = isNaN(parsed) ? val : parsed;
            } else if (boolFields.includes(key)) {
                cleaned[key] = val === 'true' || val === true;
            } else {
                cleaned[key] = val;
            }
        }
    });
    return cleaned;
}

export function updatePayload() {
    let senderObj = {};
    let recipientObj = {};
    let ref1 = state.reference;
    const payload = {};

    try { senderObj = JSON.parse(state.senderJson); } catch (e) { }
    try { recipientObj = JSON.parse(state.recipientJson); } catch (e) { }

    if (state.appendCountries) {
        const sCode = senderObj.country || 'XX';
        const rCode = recipientObj.country || 'XX';
        ref1 = `${ref1}_${sCode}_${rCode}`;
    }

    let ref2 = state.reference2;
    if (!ref2 && state.reference) {
        ref2 = state.reference.slice(-6);
    }

    if (ref1) payload.reference = ref1;
    if (ref2) payload.reference2 = ref2;

    const cleanedDetail = cleanObject(state.shipmentDetail, ['weight', 'parcels', 'value']);
    if (Object.keys(cleanedDetail).length > 0) {
        payload.shipment_detail = cleanedDetail;
    }

    payload.sender = senderObj;
    payload.recipient = recipientObj;

    if (state.includeProducts) {
        const processedProducts = state.products.map(p => {
            const cleanedProduct = cleanObject(p, ['value', 'qty', 'weight']);
            delete cleanedProduct.includeDG;
            delete cleanedProduct.dgDetails;
            delete cleanedProduct.includeCommodity;
            delete cleanedProduct.commodityDetails;

            if (p.includeDG) {
                const cleanedDG = cleanObject(p.dgDetails, ['amount'], ['is_accessible']);
                cleanedDG.is_dangerous = true;

                if (Object.keys(cleanedDG).length > 0) {
                    cleanedProduct.dangerous_goods = cleanedDG;
                }
            }

            if (p.includeCommodity) {
                const cleanedComm = cleanObject(p.commodityDetails);
                Object.assign(cleanedProduct, cleanedComm);
            }
            return cleanedProduct;
        });

        const filteredProducts = processedProducts.filter(p => Object.keys(p).length > 0);
        if (filteredProducts.length > 0) {
            payload.products = filteredProducts;
        }
    }

    els.payloadPreview.value = JSON.stringify(payload, null, 2);
    els.syncBanner.classList.add('hidden');
}

export function handleCopy() {
    const text = els.payloadPreview.value;
    navigator.clipboard.writeText(text).then(() => {
        const icon = els.copyBtn.querySelector('[data-lucide]');
        const originalIcon = icon.getAttribute('data-lucide');

        els.copyText.textContent = 'Copied!';
        icon.setAttribute('data-lucide', 'check');
        icon.classList.add('text-emerald-400');
        if (window.lucide) {
            window.lucide.createIcons();
        }

        setTimeout(() => {
            els.copyText.textContent = 'Copy Payload';
            const currentIcon = els.copyBtn.querySelector('[data-lucide]');
            if (currentIcon) {
                currentIcon.setAttribute('data-lucide', originalIcon);
                currentIcon.classList.remove('text-emerald-400');
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            }
        }, 2000);
    });
}

// Expose functions to window for HTML event handlers
window.generateRef1 = generateRef1;
window.syncFromProducts = syncFromProducts;
window.addProduct = addProduct;
window.removeProduct = removeProduct;
window.updateProductField = updateProductField;
window.applyDGTemplate = applyDGTemplate;
window.toggleProductDG = toggleProductDG;
window.toggleProductCommodity = toggleProductCommodity;
window.copyCommodityToAll = copyCommodityToAll;
window.handleCopy = handleCopy;

window.onload = init;
