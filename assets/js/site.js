/* ==========================================================
   G & A — 共通スクリプト
   ヘッダー / 日数カウンター / スクロール演出 / ライトボックス
   ========================================================== */
(() => {
    'use strict';

    const START_DATE = new Date('2017-11-15T00:00:00');

    // ------------------------------------------------------
    // 交際日数カウンター（[data-days] をすべて更新）
    // ------------------------------------------------------
    function updateDays() {
        const diff = Math.floor((Date.now() - START_DATE.getTime()) / 86400000);
        document.querySelectorAll('[data-days]').forEach((el) => {
            el.textContent = diff.toLocaleString();
        });
    }

    // ------------------------------------------------------
    // ヘッダー：スクロールで背景を付ける
    // ------------------------------------------------------
    function initHeader() {
        const header = document.querySelector('.site-header');
        if (!header) return;

        const onScroll = () => {
            header.classList.toggle('is-solid', window.scrollY > 24);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    // ------------------------------------------------------
    // モバイルナビ（ドロワー）
    // ------------------------------------------------------
    function initDrawer() {
        const toggle = document.querySelector('.nav-toggle');
        const drawer = document.querySelector('.nav-drawer');
        if (!toggle || !drawer) return;

        // 閉じる（✕）ボタンをメニュー内に生成
        const closeBtn = document.createElement('button');
        closeBtn.className = 'drawer-close';
        closeBtn.setAttribute('aria-label', '閉じる');
        closeBtn.innerHTML = '&times;';
        drawer.appendChild(closeBtn);

        const close = () => {
            toggle.classList.remove('is-open');
            drawer.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        toggle.addEventListener('click', () => {
            const open = drawer.classList.toggle('is-open');
            toggle.classList.toggle('is-open', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        closeBtn.addEventListener('click', close);
        drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
        // リンク以外の余白をタップしても閉じる
        drawer.addEventListener('click', (e) => {
            if (e.target === drawer) close();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') close();
        });
    }

    // ------------------------------------------------------
    // スクロールで浮かび上がる演出
    // .reveal を監視。 .moment / .chapter には自動付与。
    // ------------------------------------------------------
    function initReveal() {
        document.querySelectorAll('.moment, .chapter').forEach((el) => {
            el.classList.add('reveal');
        });

        const targets = document.querySelectorAll('.reveal');
        if (!targets.length) return;

        if (!('IntersectionObserver' in window)) {
            targets.forEach((el) => el.classList.add('is-visible'));
            return;
        }

        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

        targets.forEach((el) => io.observe(el));
    }

    // ------------------------------------------------------
    // ライトボックス（.photo-grid 内の画像を拡大表示）
    // ------------------------------------------------------
    function initLightbox() {
        const figures = Array.from(document.querySelectorAll('.photo-grid figure'));
        if (!figures.length) return;

        const box = document.createElement('div');
        box.className = 'lightbox';
        box.innerHTML = `
            <button class="lightbox-btn lightbox-close" aria-label="閉じる">&times;</button>
            <button class="lightbox-btn lightbox-prev" aria-label="前の写真">&#8249;</button>
            <img alt="">
            <button class="lightbox-btn lightbox-next" aria-label="次の写真">&#8250;</button>
            <div class="lightbox-counter"></div>
        `;
        document.body.appendChild(box);

        const imgEl = box.querySelector('img');
        const counter = box.querySelector('.lightbox-counter');
        let index = 0;

        const show = (i) => {
            index = (i + figures.length) % figures.length;
            const src = figures[index].querySelector('img');
            imgEl.src = src.src;
            imgEl.alt = src.alt || '';
            counter.textContent = `${index + 1} / ${figures.length}`;
        };

        const open = (i) => {
            show(i);
            box.classList.add('is-open');
            document.body.style.overflow = 'hidden';
        };

        const close = () => {
            box.classList.remove('is-open');
            document.body.style.overflow = '';
        };

        figures.forEach((fig, i) => {
            fig.addEventListener('click', () => open(i));
        });

        box.querySelector('.lightbox-close').addEventListener('click', close);
        box.querySelector('.lightbox-prev').addEventListener('click', () => show(index - 1));
        box.querySelector('.lightbox-next').addEventListener('click', () => show(index + 1));
        box.addEventListener('click', (e) => {
            if (e.target === box) close();
        });

        document.addEventListener('keydown', (e) => {
            if (!box.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            if (e.key === 'ArrowLeft') show(index - 1);
            if (e.key === 'ArrowRight') show(index + 1);
        });
    }

    // ------------------------------------------------------
    // Service Worker 登録
    // ------------------------------------------------------
    function initServiceWorker() {
        if (!('serviceWorker' in navigator)) return;
        const path = document.body.dataset.swPath || 'sw.js';
        navigator.serviceWorker.register(path).catch(() => { /* オフライン機能なしで続行 */ });
    }

    document.addEventListener('DOMContentLoaded', () => {
        updateDays();
        initHeader();
        initDrawer();
        initReveal();
        initLightbox();
        initServiceWorker();
    });
})();
