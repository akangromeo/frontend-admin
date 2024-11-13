// Konfigurasi pagination
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

// Fungsi untuk mendapatkan data mahasiswa dari API
async function getMahasiswa() {
	const url = "https://backend-ppl-production.up.railway.app/api/mahasiswa";
	try {
		const response = await fetch(url, {
			headers: {
				"Content-Type": "application/json",
			},
		});
		if (!response.ok) {
			throw new Error(`Response status: ${response.status}`);
		}

		const json = await response.json();
		return json;
	} catch (error) {
		console.error(error.message);
	}
}

// Fungsi untuk menampilkan tabel mahasiswa
async function initializeMahasiswaTable() {
	const mainTable = document.getElementById("datatablesSimple");
	const tbody = mainTable.querySelector("tbody");
	tbody.innerHTML = "";

	try {
		const mahasiswa = await getMahasiswa();
		const paginatedData = paginate(mahasiswa, ITEMS_PER_PAGE, currentPage);

		paginatedData.forEach((mhs, index) => {
			const row = document.createElement("tr");
			row.innerHTML = `
                <td>${(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td>${mhs.nama}</td>
                <td>${mhs.nim}</td>
                <td>
                    <button onclick="showDetails('${
											mhs.nim
										}')" class="btn btn-primary btn-sm">
                        Details
                    </button>
                </td>
            `;
			tbody.appendChild(row);
		});

		// Initialize DataTable
		if (!mainTable.classList.contains("dataTable-table")) {
			new simpleDatatables.DataTable(mainTable, {
				perPageSelect: false,
				perPage: ITEMS_PER_PAGE,
			});
		}
	} catch (error) {
		console.error("Error initializing table:", error);
	}
}

// Fungsi untuk pagination
function paginate(items, itemsPerPage, pageNumber) {
	const startIndex = (pageNumber - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	return items.slice(startIndex, endIndex);
}

// Fungsi untuk menampilkan detail mahasiswa
function showDetails(nim) {
	window.location.href = `tables.html?nim=${nim}`;
}

// Initialize saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
	initializeMahasiswaTable();
});
