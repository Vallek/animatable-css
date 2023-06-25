const fetch = require('node-fetch');
const fs = require('node:fs');
const express = require('express');
const cors = require('cors');
const path = require('path');
const date = new Date();

// Arrays to store api data
let specsAr = [];
let anim = [];
let notAnim = [];
let other = [];
let notAnimTitles = [];
let animTitles = [];
let otherTitles = [];

// Get data from api
async function fetchF() {
	// Get all specs urls
  let indexResponse = await fetch('https://w3c.github.io/webref/ed/index.json');
  if (indexResponse.ok) {
		let json = await indexResponse.json();
    let result = json.results;
    result.map(async spec => {
			specsAr.push(spec);
			if (spec.css !== undefined) {
        let cssPath = spec.css;
        let SpecUrl = 'https://w3c.github.io/webref/ed/' + cssPath;
        // Get data from each spec
        let specsResponse = await fetch(SpecUrl);
        if (specsResponse.ok) {
          let json = await specsResponse.json();
          let specs = json.spec;
          // Get Each spec headings
          let title = specs.title;
          // Get all properties from each spec
          let properties = json.properties;
          properties.map(el => {
            // Not animatable
            if (
              el.animationType === 'not animatable' ||
              el.animatable == 'no' ||
              el.animatable == 'No'
            ) {
							el.title = title;	
							el.url = spec.url;	
              notAnim.push(el);
							// Get only uniq titles
							notAnimTitles.push(title);
							notAnimTitles = [...new Set(notAnimTitles)];
            }
            // Animatable
            else if (
              el.animationType !== undefined ||
              el.animatable !== undefined ||
              el.animatable == 'yes' ||
              el.animatable == 'Yes'
            ) {
							el.title = title;	
							el.url = spec.url;
              anim.push(el);
							animTitles.push(title);
							animTitles = [...new Set(animTitles)];
            } 
            // Exceptions
            // Skip specs about new properties with repeated old ones
            else if (
              !el.newValues &&
              !el.name.includes('-webkit')
            ) {
							el.title = title;	
							el.url = spec.url;
              other.push(el);
							otherTitles.push(title);
							otherTitles = [...new Set(otherTitles)];
            }
            // Removed repeats
            // else {
            //   console.log(el.name + ' - ' + el.animationType + ' - ' + title);
            // }
          });
        }
        else {
          console.log(specsResponse);
        }
      }
    });
		console.log('FUNC');
  }
  else {
		console.log(indexResponse);
  }
}

// Server
let app = express();
app.use(cors());

// Build static page file
const fileName = './dist/index.html';
const stream = fs.createWriteStream(fileName);

stream.once('open', async function() {
	await fetchF();
	fetchF().then(() => {
		// Animatable
	let animHtml = animTitles.map(el => {
		let title = el;
		let item = anim.map(el => {
			let propName = el.name;
			if (el.title == title) {
				let item = `<li class="property"><a class="property__link" href="${el.url + '#propdef-' + el.name}">${propName}</a>
				${el.animationType !== undefined ? `<p class="property__type">Animation type: ${el.animationType}</p>` : `<p class="property__type">${el.animatable}</p>`}</li>`;
				return item;
			}
		}).join('');
		let list = `<ul>${item}</ul>`;
		let html = `<h3>${title}</h3>`;
		let section = `<section>${html}${list}</section>`;
		return section;
	}).join('');
	// Not animatable
	let notAnimHtml = notAnimTitles.map(el => {
		let title = el;
		let item = notAnim.map(el => {
			let propName = el.name;
			if (el.title == title) {
				let item = `<li class="property"><a class="property__link" href="${el.url + '#propdef-' + el.name}">${propName}</a></li>`;
				return item;
			}
		}).join('');
		let list = `<ul>${item}</ul>`;
		let html = `<h3>${title}</h3>`;
		let section = `<section>${html}${list}</section>`;
		return section;
	}).join('');
	// Exceptions
	let otherHtml = otherTitles.map(el => {
		let title = el;
		let item = other.map(el => {
			let propName = el.name;
			if (el.title == title) {
				let item = `<li class="property"><a class="property__link" href="${el.url + '#propdef-' + el.name}">${propName}</a></li>`;
				return item;
			}
		}).join('');
		let list = `<ul>${item}</ul>`;
		let html = `<h3>${title}</h3>`;
		let section = `<section>${html}${list}</section>`;
		return section;
	}).join('');

	let buildHtml = `
	<!DOCTYPE html>
	<html>
	<head>
		<meta charset="utf-8">
		<title>Animatable and not animatable CSS properties</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="Lists of Animatable and not animatable CSS properties from W3C api">
		<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
		<link rel="manifest" href="/site.webmanifest">
		<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
		<meta name="msapplication-TileColor" content="#da532c">
		<meta name="theme-color" content="#ffffff">
		<link rel="stylesheet" href="css/style.css">
	</head>
	<body class="page">
	<main class="page__main">
		<h1 class="page__title">Animatable and not animatable CSS properties</h1>
		<div class="page__notes">
			<p>This page contains lists of animatable and not animatable CSS properties. There <a href="https://web.archive.org/web/20230131022559/https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties">was</a> a list like this on MDN but it was removed (see <a href="https://github.com/mdn/content/issues/27042">discussion here</a>), so I decided to make one) I'd like to thank @yarusome and @Josh-Cena for replying and providing a link to the W3C api.</p>
			<p>This page is <em>not</em> affiliated with W3C or MDN. However it uses W3C <a href="https://github.com/w3c/webref">open API</a> to get all the data from specifications.</p>
			<p>Some values may differ between W3C api and any other sources (including MDN). Always check different sources and test it yourself!</p>
			<p>The point of this page is to be fully automated without need to manual edits. But if you found a problem please create an issue on <a href="https://github.com/Vallek/animatable-css">github</a>.</p>
			<p>IF YOU DON'T SEE PROPERTIES UPDATE THE PAGE (try several times, with F5, CTRL+F5)<p>
			<p><span>created by: <a href="https://github.com/Vallek">Vallek</a></span></p>
		</div>
		<h2>Syntax, how to use:</h2>
		<blockquote class="page__syntax">
			<p><strong>Spec Title</strong><span> - name of W3C spec where property belongs</span></p>
			<ul>
				<li>
					<p><strong>css-property-name</strong><span> - anchor link to the part of spec about this property.</span></p>
					<p><strong>Animation type</strong><span> - you can read about types <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties#animation_types">on MDN</a></span></p>
				</li>
			</ul>
		</blockquote>
		<section class="contents">
			<h2>Contents</h2>
			<ol class="contents__list">
				<li>
					<a href="#anim">Animatable CSS properties</a>
				</li>
				<li>
					<a href="#not-anim">Not animatable CSS properties</a>
				</li>
				<li>
					<a href="#other">Other cases</a>
				</li>
			</ol>
		</section>
		<section class="page__section">
			<h2 id="anim"><a href="#anim">Animatable CSS properties</a></h2>
			<div class="section__notes">
				<p>If it says "see §" as animation type value just click on property link. You will find an anchor link to the specific part of spec there.</p>
				<p>If it says "see individual properties" you can find them close to the shorthand or once again in specs following property link.</p>
			</div>
			<div class="lists anim">${animHtml}</div>
		</section>
		<section class="page__section">
			<h2 id="not-anim"><a href="#not-anim">Not animatable CSS properties</a></h2>
			<div class="section__notes">
				<p>You can see a lot of animation/transition properties here. That's because they animate others but can't be animated themselves.</p>
			</div>
			<div class="lists non-anim">${notAnimHtml}</div>
		</section>
		<section class="page__section">
			<h2 id="other"><a href="#other">Other cases</a></h2>
			<div class="section__notes">
				<p>This is a list of everything else from api that didn't fit main lists. It happens if there is no animation type so api returns <code>undefined</code>. For example <code>z-index</code>. It has no animation type in specs. And yet on MDN it has <code>an integer</code> which is same as <code>discrete</code>. Meaning it has no real transition but still go from start to end with swap at 50%.</p>
				<p>There are also some other properties that are duplicates from different specs or with -webkit prefix that already are in main lists. They are filtered out automatically. If you noticed something is missing please create an issue on <a href="https://github.com/Vallek/animatable-css">github</a>.</p>
			</div>
			<div class="lists other">${otherHtml}</div>
		</section>
		<section class="footer">
			<span>Created by: <a href="https://github.com/Vallek">Vallek</a> using W3C API, Node.js and Vercel, <span class="current-year">${date.getFullYear()}</span></span>
			<p>CSS Icon from <a href="https://commons.wikimedia.org/wiki/File:CSS3_logo_and_wordmark.svg">Wiki under Creative Commons</a></p>
		</section>
	</main>
</body>
</html>
	`;
	stream.end(buildHtml);
	});
});

// Server 
// app.listen(process.env.PORT || 3000);
app.use(express.static(__dirname + "/dist/"));