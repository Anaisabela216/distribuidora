// Base de dados padrão dos produtos
const produtos = [
    // Não Alcoólicas
    { cat: "Bebidas Não Alcoólicas", nome: "Coca-Cola 2L", comprada: 0, sobra: 0, tagColor: "bg-amber-100 text-amber-800" },
    { cat: "Bebidas Não Alcoólicas", nome: "Guaraná Antarctica", comprada: 0, sobra: 0, tagColor: "bg-amber-100 text-amber-800" },
    { cat: "Bebidas Não Alcoólicas", name: "Fanta Laranja", comprada: 0, sobra: 0, tagColor: "bg-amber-100 text-amber-800" },
    { cat: "Bebidas Não Alcoólicas", nome: "Água sem Gás 500ml", comprada: 0, sobra: 0, tagColor: "bg-amber-100 text-amber-800" },
    { cat: "Bebidas Não Alcoólicas", nome: "Energético Red Bull", comprada: 0, sobra: 0, tagColor: "bg-amber-100 text-amber-800" },

    // Alcoólicas
    { cat: "Bebidas Alcoólicas", nome: "Cerveja Pilsen 473ml", comprada: 0, sobra: 0, tagColor: "bg-red-100 text-red-800" },
    { cat: "Bebidas Alcoólicas", nome: "Cerveja Garrafa 600ml", comprada: 0, sobra: 0, tagColor: "bg-red-100 text-red-800" },
    { cat: "Bebidas Alcoólicas", nome: "Whisky Red Label 1L", comprada: 0, sobra: 0, tagColor: "bg-red-100 text-red-800" },
    { cat: "Bebidas Alcoólicas", nome: "Vodka Smirnoff 1L", comprada: 0, sobra: 0, tagColor: "bg-red-100 text-red-800" },

    // Outros Itens
    { cat: "Outros Itens", nome: "Gelo em Saco (5kg)", comprada: 0, sobra: 0, tagColor: "bg-blue-100 text-blue-800" },
    { cat: "Outros Itens", nome: "Carvão Vegetal 5kg", comprada: 0, sobra: 0, tagColor: "bg-blue-100 text-blue-800" },
    { cat: "Outros Itens", nome: "Copo Descartável (Cx)", comprada: 0, sobra: 0, tagColor: "bg-blue-100 text-blue-800" }
];

let meuGrafico = null;

// Inicialização da Página
document.addEventListener("DOMContentLoaded", () => {
    // Definir data de hoje no campo de entrada
    document.getElementById("dataEntrada").valueAsDate = new Date();
    
    renderizarTabela();
    processarEstoque();
});

// Renderizar linhas da tabela no HTML
function renderizarTabela() {
    const tbody = document.getElementById("tabelaProdutos");
    tbody.innerHTML = "";

    produtos.forEach((prod, index) => {
        const row = document.createElement("tr");
        row.className = "hover:bg-slate-50 transition";

        row.innerHTML = `
            <td class="p-3">
                <div class="font-medium text-slate-800">${prod.nome}</div>
                <span class="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${prod.tagColor}">${prod.cat}</span>
            </td>
            <td class="p-3">
                <input type="number" id="compra_${index}" value="${prod.comprada}" min="0" onchange="calcularLinha(${index})" class="w-24 border border-slate-300 rounded px-2 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
            </td>
            <td class="p-3">
                <input type="number" id="sobra_${index}" value="${prod.sobra}" min="0" onchange="calcularLinha(${index})" class="w-24 border border-slate-300 rounded px-2 py-1 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500">
            </td>
            <td class="p-3 text-right font-bold text-emerald-600" id="previsao_${index}">
                ${prod.comprada - prod.sobra} cx
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Recalcular valor individual de um item
function calcularLinha(index) {
    const compra = parseInt(document.getElementById(`compra_${index}`).value) || 0;
    const sobra = parseInt(document.getElementById(`sobra_${index}`).value) || 0;
    const previsao = compra - sobra;

    document.getElementById(`previsao_${index}`).innerText = `${previsao} cx`;
    processarEstoque();
}

// Processar totais acumulados e atualizar indicadores e gráfico
function processarEstoque() {
    let totalComprado = 0;
    let totalSobra = 0;
    let totalPrevisao = 0;

    let catTotais = {
        "Bebidas Não Alcoólicas": 0,
        "Bebidas Alcoólicas": 0,
        "Outros Itens": 0
    };

    produtos.forEach((prod, index) => {
        const compra = parseInt(document.getElementById(`compra_${index}`).value) || 0;
        const sobra = parseInt(document.getElementById(`sobra_${index}`).value) || 0;
        const previsao = compra - sobra;

        totalComprado += compra;
        totalSobra += sobra;
        totalPrevisao += previsao;

        if (catTotais.hasOwnProperty(prod.cat)) {
            catTotais[prod.cat] += compra;
        }
    });

    // Atualizar os cards KPI
    document.getElementById("kpiComprado").innerText = `${totalComprado.toLocaleString("pt-BR")} cx`;
    document.getElementById("kpiSobra").innerText = `${totalSobra.toLocaleString("pt-BR")} cx`;
    document.getElementById("kpiPrevisao").innerText = `${totalPrevisao.toLocaleString("pt-BR")} cx`;

    // Atualizar Gráfico
    atualizarGrafico(Object.keys(catTotais), Object.values(catTotais));
}

// Função para desenhar/atualizar o gráfico com Chart.js
function atualizarGrafico(labels, data) {
    const ctx = document.getElementById("graficoEstoque").getContext("2d");

    if (meuGrafico) {
        meuGrafico.destroy();
    }

    meuGrafico = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ["#f59e0b", "#ef4444", "#3b82f6"],
                borderWidth: 2,
                borderColor: "#ffffff"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                }
            }
        }
    });
}