async function carregarBanners() {
    if (!bannerSlider) return;
    try {
        const snapshot = await getDocs(collection(db, "banners"));
        if (!snapshot.empty) {
            let bannersHtml = "";
            snapshot.docs.forEach((doc, index) => {
                const b = doc.data();
                const ativoClass = index === 0 ? "active slide" : "slide";
                bannersHtml += `<img src="${b.imagem || b.url}" class="${ativoClass}" alt="Banner">`;
            });
            bannerSlider.innerHTML = bannersHtml;
        } else {
            throw new Error("Sem banners no Firebase");
        }
    } catch (e) {
        // Exibe um banner de exemplo lindo para o It Pink Club não sumir
        bannerSlider.innerHTML = `
            <img src="https://placehold.co/1200x400/fff0f7/ff3f9b?text=It+Pink+Club+%F0%9F%92%96+Achadinhos" class="slide active" alt="Banner It Pink Club">
        `;
    }
}