export const defaultSender = {
    "company": "Global Village Workshop",
    "firstname": "Simon",
    "lastname": "Pr",
    "address_line_1": "39 Duke Street",
    "address_line_2": "-",
    "city": "Brighton",
    "county": "England",
    "country": "GB",
    "postcode": "BN1 1AG",
    "telephone": "7123456789",
    "mobile": "7123456789",
    "email": "sender@test.com"
};

export const defaultRecipient = {
    "firstname": "John",
    "lastname": "L",
    "address_line_1": "4609 Maple Walk Dr",
    "city": "Lakeland",
    "county": "Tennessee",
    "country": "US",
    "postcode": "38002",
    "telephone": "+19012345678",
    "email": "recipient@test.com"
};

export const defaultProduct = {
    name: "Sample Product",
    sku: "SKU-001",
    qty: "1",
    value: "10.0",
    weight: "0.5",
    commodity_code: "",
    country_of_manufacture: "",
    includeDG: false,
    includeCommodity: false,
    dgDetails: {
        is_dangerous: true,
        category: "",
        package_type: "",
        un_number: "",
        packing_group: "",
        amount: "",
        unit: "g",
        is_accessible: ""
    },
    commodityDetails: {
        commodity_code: "520811",
        commodity_description: "Cotton cloth, plain weave, unbleached",
        commodity_manucountry: "GBR",
        commodity_composition: "Cotton"
    }
};

export const dgCategories = [
    { code: "DI", name: "Dry Ice" },
    { code: "FRDG", name: "Fully Regulated Dangerous Goods" },
    { code: "LQDG", name: "Limited Quantities Dangerous Goods" },
    { code: "LBS2", name: "Lithium Batteries, Section II" },
    { code: "SLB", name: "Standalone Lithium Batteries ADR Special Provision 188" },
    { code: "BSCB", name: "Biological Substances Category B" },
    { code: "DGEQ", name: "Dangerous Goods in Excepted Quantities" },
    { code: "GMOM", name: "Genetically Modified Organisms and Microorganisms" },
    { code: "RMEP", name: "Radioactive Material Excepted Package" }
];

export const dgPackageTypes = [
    { code: "BAG", name: "Bag" },
    { code: "BOX", name: "Box" },
    { code: "CAN", name: "Can" },
    { code: "CAR", name: "Carton" },
    { code: "CYL", name: "Cylinder" },
    { code: "DRU", name: "Drum" },
    { code: "IBC", name: "Intermediate Bulk Container" }
];

export const dgPackingGroups = [
    { code: "I", name: "I" },
    { code: "II", name: "II" },
    { code: "III", name: "III" }
];

export const dgUnits = [
    { code: "ml", name: "ml" },
    { code: "g", name: "g" },
];

export const dgTemplates = [
    {
        name: "Luxury Perfume Samples",
        commodity_code: "330300",
        commodity_description: "Perfumes and toilet waters",
        un_number: "UN1266",
        category: "DGEQ",
        amount: "30",
        unit: "ml",
        package_type: "BOX"
    },
    {
        name: "Lab Reagent (Methanol)",
        commodity_code: "290511",
        commodity_description: "Methanol (methyl alcohol)",
        un_number: "UN1230",
        category: "DGEQ",
        amount: "30",
        unit: "ml",
        package_type: "BOX"
    }
];

export const defaultDg = {
    category: "FRDG",
    package_type: "BOX",
    un_number: "UN1203",
    class: "3",
    packing_group: "",
    amount: "",
    unit: "g"
};

export const apiEnvironments = [
    { name: "Local", url: "https://shiptheory.local/v1/shipments" },
    { name: "Production", url: "https://api.shiptheory.com/v1/shipments" }
];

