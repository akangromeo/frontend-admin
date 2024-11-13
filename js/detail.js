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

// Fungsi untuk mendapatkan IPK mahasiswa
async function getIpkMhsByNim(nim) {
	var url = `https://backend-ppl-production.up.railway.app/mahasiswa/nim/${nim}`;
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

// Fungsi untuk mendapatkan KRS mahasiswa
async function getKrsMhs(nim) {
	var url = `https://backend-ppl-production.up.railway.app/api/mahasiswa/krs/${nim}`;
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

// Fungsi untuk menampilkan data KRS berdasarkan semester
function filterKrsBySemester(krsData, semester) {
	return krsData.filter((mk) => mk.semesterMk === semester);
}

// Fungsi untuk menampilkan detail mahasiswa
async function displayStudentDetail(nim) {
	try {
		const mahasiswa = await getIpkMhsByNim(nim);
		const krsData = await getKrsMhs(nim);

		if (mahasiswa) {
			// Update header dan breadcrumb
			document.querySelector("h1.mt-4").textContent = mahasiswa.nama;
			document.querySelector(".breadcrumb-item.active").textContent =
				mahasiswa.nim;

			// Update IPK dan IPS
			document.getElementById(
				"nilaiIPK"
			).textContent = `IPK: ${mahasiswa.cumulativeIPK}`;
			document.getElementById("nilaiIPS").textContent = `IPS: ${
				mahasiswa.currentIPS || "-"
			}`;

			// Tampilkan data KRS
			updateKrsTable(krsData);
		}
	} catch (error) {
		console.error("Error displaying student detail:", error);
	}
}

// Fungsi untuk update tabel KRS
function updateKrsTable(krsData) {
	const table = document.getElementById("datatablesSimple");
	const tbody = table.querySelector("tbody");
	tbody.innerHTML = "";

	krsData.forEach((mk, index) => {
		const row = document.createElement("tr");
		row.innerHTML = `
            <td>${index + 1}</td>
            <td>${mk.kodeMk}</td>
            <td>${mk.mataKuliah}</td>
            <td>${mk.sks}</td>
            <td>${mk.nilai}</td>
            <td>${convertNilaiToIndex(mk.nilai)}</td>
        `;
		tbody.appendChild(row);
	});

	// Initialize DataTable
	if (!table.classList.contains("dataTable-table")) {
		new simpleDatatables.DataTable(table, {
			perPageSelect: false,
			perPage: 10,
		});
	}
}

// Fungsi untuk konversi nilai angka ke index
function convertNilaiToIndex(nilai) {
	if (nilai >= 85) return "A";
	if (nilai >= 80) return "A-";
	if (nilai >= 75) return "B+";
	if (nilai >= 70) return "B";
	if (nilai >= 65) return "B-";
	if (nilai >= 60) return "C+";
	if (nilai >= 55) return "C";
	if (nilai >= 40) return "D";
	return "E";
}

// Event listener untuk dropdown semester
document.addEventListener("DOMContentLoaded", () => {
	const urlParams = new URLSearchParams(window.location.search);
	const nim = urlParams.get("nim");

	if (nim) {
		displayStudentDetail(nim);

		// Setup event listeners for semester dropdown
		document.querySelectorAll(".dropdown-item").forEach((item) => {
			item.addEventListener("click", async function (e) {
				e.preventDefault();
				const selectedSemester = this.textContent.split(" ")[1];
				document.getElementById("dropdownMenuButton1").textContent =
					this.textContent;

				const krsData = await getKrsMhs(nim);
				const filteredKrs = filterKrsBySemester(
					krsData,
					parseInt(selectedSemester)
				);
				updateKrsTable(filteredKrs);
			});
		});
	}
});
