// cv-generator.js — Generatore CV dinamico con riordinamento drag-and-drop
(function () {
    'use strict';

    // --- Helpers ---
    function getSiteLang() {
        return localStorage.getItem('portfolio-lang') || 'it';
    }

    // Lingua scelta per il CV (indipendente dal sito)
    var cvLang = 'it';

    function t(obj, lang) {
        if (obj == null) return '';
        if (typeof obj === 'string') return obj;
        var l = lang || cvLang;
        return obj[l] || obj.it || '';
    }

    // Ordine sezioni corrente (viene aggiornato dal drag-and-drop)
    var sectionOrder = [];

    // SVG icona drag handle (6 puntini)
    var gripSvg = '<svg viewBox="0 0 16 16" fill="currentColor"><circle cx="5" cy="3" r="1.5"/><circle cx="11" cy="3" r="1.5"/><circle cx="5" cy="8" r="1.5"/><circle cx="11" cy="8" r="1.5"/><circle cx="5" cy="13" r="1.5"/><circle cx="11" cy="13" r="1.5"/></svg>';

    // --- Render toggle con drag handle ---
    function renderSectionToggles() {
        var container = document.getElementById('cvSectionsList');
        if (!container) return;
        container.innerHTML = '';

        // Inizializza ordine sezioni
        sectionOrder = CV_DATA.sections.map(function (s) { return s.key; });

        CV_DATA.sections.forEach(function (section) {
            var row = document.createElement('div');
            row.className = 'cv-section-row';
            row.setAttribute('draggable', 'true');
            row.dataset.key = section.key;

            row.innerHTML =
                '<div class="cv-drag-handle" title="Trascina per riordinare">' + gripSvg + '</div>' +
                '<label class="cv-toggle-label">' +
                    '<input type="checkbox" checked data-section="' + section.key + '">' +
                    '<span class="cv-toggle-switch"></span>' +
                    '<span class="cv-toggle-text">' + t(section.label, getSiteLang()) + '</span>' +
                '</label>';

            container.appendChild(row);
        });

        initDragAndDrop(container);
    }

    // --- Drag and Drop ---
    function initDragAndDrop(container) {
        var draggedEl = null;

        container.addEventListener('dragstart', function (e) {
            var row = e.target.closest('.cv-section-row');
            if (!row) return;
            draggedEl = row;
            row.classList.add('cv-dragging');
            e.dataTransfer.effectAllowed = 'move';
            e.dataTransfer.setData('text/plain', row.dataset.key);
        });

        container.addEventListener('dragend', function () {
            if (draggedEl) {
                draggedEl.classList.remove('cv-dragging');
                draggedEl = null;
            }
            // Rimuovi tutti gli indicatori
            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }
        });

        container.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            var row = e.target.closest('.cv-section-row');
            if (!row || row === draggedEl) return;

            // Rimuovi indicatori precedenti
            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }
            row.classList.add('cv-drag-over');
        });

        container.addEventListener('dragleave', function (e) {
            var row = e.target.closest('.cv-section-row');
            if (row) row.classList.remove('cv-drag-over');
        });

        container.addEventListener('drop', function (e) {
            e.preventDefault();
            var targetRow = e.target.closest('.cv-section-row');
            if (!targetRow || !draggedEl || targetRow === draggedEl) return;

            // Inserisci prima del target
            container.insertBefore(draggedEl, targetRow);

            // Aggiorna ordine sezioni
            var rows = container.querySelectorAll('.cv-section-row');
            sectionOrder = [];
            for (var i = 0; i < rows.length; i++) {
                sectionOrder.push(rows[i].dataset.key);
                rows[i].classList.remove('cv-drag-over');
            }
        });

        // Touch support per mobile
        var touchDragged = null;
        var touchClone = null;
        var touchStartY = 0;

        container.addEventListener('touchstart', function (e) {
            var handle = e.target.closest('.cv-drag-handle');
            if (!handle) return;
            var row = handle.closest('.cv-section-row');
            if (!row) return;

            touchDragged = row;
            touchStartY = e.touches[0].clientY;

            // Crea clone visuale
            touchClone = row.cloneNode(true);
            touchClone.style.position = 'fixed';
            touchClone.style.zIndex = '10000';
            touchClone.style.width = row.offsetWidth + 'px';
            touchClone.style.opacity = '0.8';
            touchClone.style.pointerEvents = 'none';
            touchClone.style.left = row.getBoundingClientRect().left + 'px';
            touchClone.style.top = row.getBoundingClientRect().top + 'px';
            document.body.appendChild(touchClone);

            row.classList.add('cv-dragging');
        }, { passive: true });

        container.addEventListener('touchmove', function (e) {
            if (!touchDragged || !touchClone) return;
            e.preventDefault();

            var touch = e.touches[0];
            touchClone.style.top = touch.clientY - 20 + 'px';

            // Trova l'elemento sotto il touch
            touchClone.style.display = 'none';
            var elemBelow = document.elementFromPoint(touch.clientX, touch.clientY);
            touchClone.style.display = '';

            var rows = container.querySelectorAll('.cv-section-row');
            for (var i = 0; i < rows.length; i++) {
                rows[i].classList.remove('cv-drag-over');
            }

            if (elemBelow) {
                var targetRow = elemBelow.closest('.cv-section-row');
                if (targetRow && targetRow !== touchDragged) {
                    targetRow.classList.add('cv-drag-over');
                }
            }
        }, { passive: false });

        container.addEventListener('touchend', function () {
            if (!touchDragged) return;

            // Trova il target con cv-drag-over
            var target = container.querySelector('.cv-drag-over');
            if (target && target !== touchDragged) {
                container.insertBefore(touchDragged, target);
            }

            // Cleanup
            touchDragged.classList.remove('cv-dragging');
            if (touchClone && touchClone.parentNode) {
                touchClone.parentNode.removeChild(touchClone);
            }

            // Aggiorna ordine
            var rows = container.querySelectorAll('.cv-section-row');
            sectionOrder = [];
            for (var i = 0; i < rows.length; i++) {
                sectionOrder.push(rows[i].dataset.key);
                rows[i].classList.remove('cv-drag-over');
            }

            touchDragged = null;
            touchClone = null;
        });
    }

    // --- Template CV HTML per PDF ---
    function buildCvHtml(selectedKeys) {
        var m = CV_DATA.meta;

        // Usa l'ordine corrente delle sezioni, filtrando solo quelle selezionate
        var orderedSections = [];
        for (var i = 0; i < sectionOrder.length; i++) {
            var key = sectionOrder[i];
            if (selectedKeys.indexOf(key) === -1) continue;
            for (var j = 0; j < CV_DATA.sections.length; j++) {
                if (CV_DATA.sections[j].key === key) {
                    orderedSections.push(CV_DATA.sections[j]);
                    break;
                }
            }
        }

        var html = '';

        // Contenitore A4
        html += '<div style="font-family: Inter, Helvetica, Arial, sans-serif; width: 210mm; padding: 18mm 20mm; color: #1a1a1a; font-size: 10pt; line-height: 1.55; box-sizing: border-box;">';

        // --- Header ---
        html += '<div style="display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 14px; border-bottom: 2.5px solid #0066ff; margin-bottom: 18px;">';
        html += '<div>';
        html += '<div style="font-size: 24pt; font-weight: 700; color: #0066ff; letter-spacing: -0.5px; margin: 0; line-height: 1.1;">' + m.name + '</div>';
        html += '<div style="font-size: 12pt; color: #555; margin-top: 4px; font-weight: 400;">' + t(m.title) + '</div>';
        html += '</div>';
        html += '<div style="text-align: right; font-size: 8.5pt; color: #666; line-height: 2;">';
        html += '<div>' + m.phone + '</div>';
        html += '<div>' + m.email + '</div>';
        html += '<div>' + m.location + '</div>';
        html += '<div>' + m.website + '</div>';
        html += '<div>' + m.github + '</div>';
        html += '<div>' + m.linkedin + '</div>';
        html += '</div>';
        html += '</div>';

        // --- Sezioni nell'ordine scelto ---
        orderedSections.forEach(function (section) {
            html += renderSection(section);
        });

        html += '</div>';
        return html;
    }

    function sectionHeading(label) {
        return '<div style="font-size: 10pt; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #0066ff; border-bottom: 1px solid #ddd; padding-bottom: 4px; margin: 20px 0 10px;">' + t(label) + '</div>';
    }

    function renderSection(section) {
        var html = sectionHeading(section.label);

        switch (section.type) {
            case 'text':
                html += '<p style="font-size: 9.5pt; color: #333; line-height: 1.65; margin: 0;">' + t(section.content) + '</p>';
                break;

            case 'timeline':
                section.items.forEach(function (item) {
                    html += '<div style="margin-bottom: 12px; page-break-inside: avoid;">';
                    html += '<div style="display: flex; justify-content: space-between; align-items: baseline;">';
                    html += '<span style="font-size: 10pt; font-weight: 600; color: #1a1a1a;">' + t(item.title) + '</span>';
                    html += '<span style="font-size: 8pt; color: #999; font-family: \'JetBrains Mono\', monospace; white-space: nowrap; margin-left: 12px;">' + t(item.date) + '</span>';
                    html += '</div>';
                    html += '<div style="font-size: 9pt; color: #0066ff; font-weight: 500; margin-top: 1px;">' + t(item.company) + '</div>';
                    if (item.description) {
                        html += '<div style="font-size: 9pt; color: #555; margin-top: 3px; line-height: 1.5;">' + t(item.description) + '</div>';
                    }
                    html += '</div>';
                });
                break;

            case 'projects':
                section.items.forEach(function (item) {
                    html += '<div style="margin-bottom: 12px; page-break-inside: avoid;">';
                    html += '<div style="display: flex; justify-content: space-between; align-items: baseline;">';
                    html += '<span style="font-size: 10pt; font-weight: 600; color: #1a1a1a;">' + t(item.title) + '</span>';
                    html += '<span style="font-size: 8pt; color: #999; font-family: \'JetBrains Mono\', monospace; white-space: nowrap; margin-left: 12px;">' + t(item.date) + '</span>';
                    html += '</div>';
                    html += '<div style="font-size: 9pt; color: #0066ff; font-weight: 500; margin-top: 1px;">' + t(item.client) + '</div>';
                    if (item.description) {
                        html += '<div style="font-size: 9pt; color: #555; margin-top: 3px; line-height: 1.5;">' + t(item.description) + '</div>';
                    }
                    if (item.tech && item.tech.length) {
                        html += '<div style="margin-top: 5px; display: flex; flex-wrap: wrap; gap: 4px;">';
                        item.tech.forEach(function (tag) {
                            html += '<span style="font-size: 7.5pt; padding: 2px 7px; background: #f0f4ff; border: 1px solid #dde4f0; border-radius: 3px; color: #444; font-family: \'JetBrains Mono\', monospace;">' + tag + '</span>';
                        });
                        html += '</div>';
                    }
                    html += '</div>';
                });
                break;

            case 'tags':
                section.categories.forEach(function (cat) {
                    html += '<div style="margin-bottom: 10px;">';
                    html += '<div style="font-size: 8pt; font-weight: 600; text-transform: uppercase; letter-spacing: 0.08em; color: #999; margin-bottom: 5px;">' + t(cat.label) + '</div>';
                    html += '<div style="display: flex; flex-wrap: wrap; gap: 4px;">';
                    cat.tags.forEach(function (tag) {
                        html += '<span style="font-size: 8.5pt; padding: 3px 9px; background: #f5f5f5; border: 1px solid #e4e4e7; border-radius: 4px; color: #333;">' + tag + '</span>';
                    });
                    html += '</div>';
                    html += '</div>';
                });
                break;

            case 'repos':
                html += '<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">';
                section.items.forEach(function (item) {
                    html += '<div style="padding: 10px 12px; border: 1px solid #e4e4e7; border-radius: 6px; page-break-inside: avoid;">';
                    html += '<div style="display: flex; align-items: center; gap: 6px;">';
                    html += '<span style="font-size: 10pt; font-weight: 600;">' + item.name + '</span>';
                    html += '<span style="font-size: 7.5pt; padding: 1px 6px; background: #f0f4ff; border-radius: 3px; color: #0066ff; font-weight: 500;">' + item.lang + '</span>';
                    html += '</div>';
                    html += '<div style="font-size: 8.5pt; color: #555; margin-top: 3px;">' + t(item.description) + '</div>';
                    html += '<div style="font-size: 7.5pt; color: #999; margin-top: 4px;">&#9733; ' + item.stars + '</div>';
                    html += '</div>';
                });
                html += '</div>';
                break;
        }

        return html;
    }

    // --- Generazione PDF ---
    function generatePdf(selectedKeys) {
        var template = document.getElementById('cv-template');
        template.innerHTML = buildCvHtml(selectedKeys);

        // Posiziona visibilmente per html2canvas ma non visibile all'utente
        template.style.position = 'fixed';
        template.style.left = '0';
        template.style.top = '0';
        template.style.zIndex = '-9999';
        template.style.opacity = '0';
        template.style.pointerEvents = 'none';

        var filename = 'Tommaso_Patriti_CV_' + cvLang.toUpperCase() + '.pdf';

        var opt = {
            margin: 0,
            filename: filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        };

        return html2pdf().set(opt).from(template.firstElementChild).save().then(function () {
            template.style.position = 'absolute';
            template.style.left = '-9999px';
            template.style.opacity = '';
            template.style.zIndex = '';
            template.style.pointerEvents = '';
            template.innerHTML = '';
        });
    }

    // --- Logica Modal ---
    function init() {
        var openBtn = document.getElementById('openCvModal');
        var modal = document.getElementById('cvModal');
        var closeBtn = document.getElementById('closeCvModal');
        var generateBtn = document.getElementById('cvGenerate');
        var selectAllBtn = document.getElementById('cvSelectAll');

        if (!openBtn || !modal) return;

        var allSelected = true;

        // --- Language picker nel modal ---
        var langBtns = modal.querySelectorAll('.cv-lang-btn');
        for (var lb = 0; lb < langBtns.length; lb++) {
            langBtns[lb].addEventListener('click', function () {
                for (var k = 0; k < langBtns.length; k++) {
                    langBtns[k].classList.remove('active');
                }
                this.classList.add('active');
                cvLang = this.dataset.cvLang;
            });
        }

        // Apri modal
        openBtn.addEventListener('click', function () {
            allSelected = true;
            cvLang = getSiteLang();
            // Attiva il bottone lingua corretto
            for (var k = 0; k < langBtns.length; k++) {
                langBtns[k].classList.toggle('active', langBtns[k].dataset.cvLang === cvLang);
            }
            renderSectionToggles();
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if (typeof lucide !== 'undefined') lucide.createIcons();
        });

        // Chiudi modal
        function closeModal() {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeModal);

        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });

        // Seleziona/deseleziona tutto
        selectAllBtn.addEventListener('click', function () {
            allSelected = !allSelected;
            var checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            for (var i = 0; i < checkboxes.length; i++) {
                checkboxes[i].checked = allSelected;
            }
            var sl = getSiteLang();
            var span = selectAllBtn.querySelector('span');
            if (span) {
                if (allSelected) {
                    span.textContent = sl === 'it' ? 'Deseleziona tutto' : 'Deselect all';
                } else {
                    span.textContent = sl === 'it' ? 'Seleziona tutto' : 'Select all';
                }
            }
        });

        // Genera PDF
        generateBtn.addEventListener('click', function () {
            var checkboxes = modal.querySelectorAll('input[type="checkbox"]:checked');
            var selectedKeys = [];
            for (var i = 0; i < checkboxes.length; i++) {
                selectedKeys.push(checkboxes[i].dataset.section);
            }

            if (selectedKeys.length === 0) return;

            var sl = getSiteLang();
            var btnSpan = generateBtn.querySelector('span');
            var btnIcon = generateBtn.querySelector('i, .cv-spinner');

            // Stato loading
            generateBtn.disabled = true;
            if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Generazione...' : 'Generating...';
            if (btnIcon) {
                var spinner = document.createElement('div');
                spinner.className = 'cv-spinner';
                btnIcon.replaceWith(spinner);
                btnIcon = spinner;
            }

            generatePdf(selectedKeys)
                .then(function () {
                    generateBtn.disabled = false;
                    if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Scarica PDF' : 'Download PDF';
                    if (btnIcon) {
                        var icon = document.createElement('i');
                        icon.setAttribute('data-lucide', 'download');
                        btnIcon.replaceWith(icon);
                        if (typeof lucide !== 'undefined') lucide.createIcons();
                    }
                })
                .catch(function () {
                    generateBtn.disabled = false;
                    if (btnSpan) btnSpan.textContent = sl === 'it' ? 'Scarica PDF' : 'Download PDF';
                });
        });
    }

    // --- Avvio ---
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
