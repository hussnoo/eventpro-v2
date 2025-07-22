document.addEventListener('DOMContentLoaded', () => {
    // Initialize flatpickr
    flatpickr("#event-date", {
        enableTime: true,
        dateFormat: "Y-m-d H:i",
    });

    const searchForm = document.getElementById('search-form');
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Handle form submission
        const eventType = document.getElementById('event-type').value;
        const location = document.getElementById('location').value;
        const budget = document.getElementById('budget').value;
        const eventDate = document.getElementById('event-date').value;

        console.log({ eventType, location, budget, eventDate });

        const budgetSummary = calculateBudget(budget);
        displayBudgetSummary(budgetSummary);

        const vendors = getVendorRecommendations(eventType, location, budgetSummary);
        displayVendors(vendors);
        initializeMap(vendors);
    });

    function calculateBudget(totalBudget) {
        return {
            venue_decoration: totalBudget * 0.35,
            food: totalBudget * 0.30,
            documentation: totalBudget * 0.20,
            other: totalBudget * 0.15
        };
    }

    function displayBudgetSummary(summary) {
        const summaryDiv = document.getElementById('budget-summary');
        summaryDiv.innerHTML = `
            <p>Tempat & Dekorasi: IDR ${summary.venue_decoration.toLocaleString()}</p>
            <p>Makanan: IDR ${summary.food.toLocaleString()}</p>
            <p>Dokumentasi: IDR ${summary.documentation.toLocaleString()}</p>
            <p>Lainnya: IDR ${summary.other.toLocaleString()}</p>
        `;
    }

    function getVendorRecommendations(eventType, location, budget) {
        // Dummy data for vendors
        const vendors = {
            pernikahan: [
                { name: 'Gedung Pernikahan Mewah', category: 'venue_decoration', price: 20000000, lat: -6.2088, lon: 106.8456 },
                { name: 'Katering Lezat', category: 'food', price: 15000000, lat: -6.2188, lon: 106.8556 },
                { name: 'Abadi Photo', category: 'documentation', price: 10000000, lat: -6.2288, lon: 106.8656 },
            ],
            ulang_tahun: [
                { name: 'Kafe Pesta Ultah', category: 'venue_decoration', price: 5000000, lat: -6.2388, lon: 106.8756 },
                { name: 'Kue Ulang Tahun Enak', category: 'food', price: 2000000, lat: -6.2488, lon: 106.8856 },
                { name: 'Foto Ceria', category: 'documentation', price: 1500000, lat: -6.2588, lon: 106.8956 },
            ],
            seminar: [
                { name: 'Ruang Seminar Modern', category: 'venue_decoration', price: 7000000, lat: -6.2688, lon: 106.9056 },
                { name: 'Snack Box Seminar', category: 'food', price: 3000000, lat: -6.2788, lon: 106.9156 },
                { name: 'Videografi Acara', category: 'documentation', price: 4000000, lat: -6.2888, lon: 106.9256 },
            ]
        };

        const eventVendors = vendors[eventType] || [];
        return eventVendors.filter(vendor => vendor.price <= budget[vendor.category]);
    }

    function displayVendors(vendors) {
        const vendorsDiv = document.getElementById('vendors');
        vendorsDiv.innerHTML = '';

        if (vendors.length === 0) {
            vendorsDiv.innerHTML = '<p>Tidak ada vendor yang cocok dengan kriteria Anda.</p>';
            return;
        }

        vendors.forEach(vendor => {
            const vendorCard = document.createElement('div');
            vendorCard.className = 'vendor-card';
            vendorCard.innerHTML = `
                <img src="https://via.placeholder.com/150" alt="${vendor.name}">
                <div class="vendor-info">
                    <h4>${vendor.name}</h4>
                    <p>Kategori: ${vendor.category.replace('_', ' ')}</p>
                    <p>Harga: IDR ${vendor.price.toLocaleString()}</p>
                    <button class="contact-vendor" data-vendor-name="${vendor.name}">Hubungi Vendor</button>
                </div>
            `;
            vendorsDiv.appendChild(vendorCard);
        });

        document.querySelectorAll('.contact-vendor').forEach(button => {
            button.addEventListener('click', (e) => {
                const vendorName = e.target.getAttribute('data-vendor-name');
                // Log the click (in a real app, this would be an API call)
                console.log(`User clicked on "Hubungi Vendor" for ${vendorName}`);
                alert(`Mengalihkan ke WhatsApp untuk menghubungi ${vendorName}`);
                // window.location.href = `https://wa.me/62...`; // Example redirect
            });
        });
    }

    let map;
    function initializeMap(vendors) {
        if (map) {
            map.remove();
        }
        map = L.map('map').setView([-6.2088, 106.8456], 10); // Default to Jakarta

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        vendors.forEach(vendor => {
            L.marker([vendor.lat, vendor.lon]).addTo(map)
                .bindPopup(`<b>${vendor.name}</b><br>${vendor.category.replace('_', ' ')}`)
                .openPopup();
        });
    }
});
