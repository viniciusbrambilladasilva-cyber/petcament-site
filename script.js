/* Petcament · site institucional — interações */
(function () {
  'use strict';

  /* ---------- menu mobile ---------- */
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var abrir = !menu.classList.contains('open');
      menu.classList.toggle('open', abrir);
      burger.classList.toggle('open', abrir);
      burger.setAttribute('aria-expanded', String(abrir));
      burger.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    });

    // fecha ao clicar num link
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        burger.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-label', 'Abrir menu');
      });
    });
  }

  /* ---------- sombra da nav ao rolar ---------- */
  var nav = document.getElementById('nav');
  function onScroll() {
    if (nav) nav.classList.toggle('on', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ao entrar na tela ---------- */
  var alvos = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    // só esconde o que ainda não foi revelado quando há JS rodando
    var flat = /(\?|&)flat(=|&|$)/.test(location.search);
    if (!flat) document.body.classList.add('anim');
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    alvos.forEach(function (el) { io.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- ano do rodapé ---------- */
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  /* ---------- formulário -> e-mail ---------- */
  var form = document.getElementById('form');
  var note = document.getElementById('note');
  var DESTINO = 'contato@petcament.com.br';

  function marcaErro(el, erro) {
    el.classList.toggle('err', erro);
    el.setAttribute('aria-invalid', erro ? 'true' : 'false');
  }

  if (form) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      var nome = document.getElementById('nome');
      var email = document.getElementById('email');
      var tel = document.getElementById('telefone');
      var assunto = document.getElementById('assunto');
      var msg = document.getElementById('mensagem');

      var valido = true;
      [[nome, nome.value.trim().length >= 2],
       [email, /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim())],
       [msg, msg.value.trim().length >= 5]].forEach(function (par) {
        var ok = par[1];
        marcaErro(par[0], !ok);
        if (!ok && valido) { par[0].focus(); valido = false; }
      });

      if (!valido) {
        if (note) {
          note.textContent = 'Confira os campos destacados para continuar.';
          note.style.color = '#C0392B';
        }
        return;
      }

      var corpo = [
        'Nome: ' + nome.value.trim(),
        'E-mail: ' + email.value.trim(),
        'Telefone: ' + (tel.value.trim() || 'não informado'),
        'Assunto: ' + assunto.value,
        '',
        msg.value.trim(),
        '',
        '— enviado pelo site petcament.com.br'
      ].join('\n');

      var href = 'mailto:' + DESTINO +
        '?subject=' + encodeURIComponent('[Site] ' + assunto.value) +
        '&body=' + encodeURIComponent(corpo);

      window.location.href = href;

      if (note) {
        note.style.color = '';
        note.textContent = 'Abrimos seu aplicativo de e-mail com a mensagem pronta. Se nada abrir, escreva para ' + DESTINO + '.';
      }
    });

    form.querySelectorAll('input,textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        if (el.classList.contains('err')) marcaErro(el, false);
      });
    });
  }
})();
