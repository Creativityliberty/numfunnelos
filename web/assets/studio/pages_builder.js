function pageBuilder(){let fs=S.data.funnels||[];let f=fs.find(x=>x.id===S.selected)||fs[0];if(!f)return head('Éditeur de Tunnel','Créez votre premier tunnel depuis l’onglet Mes tunnels.')+`<button class="btn primary" data-nav="funnels">Mes tunnels</button>`;S.selected=f.id;let c=f.draft?.copy||{},theme=f.draft?.brand||{},sett=f.draft?.settings||{},leg=f.draft?.legal||{};let bTab=S.builderTab||'01';let switcher=fs.length>1?`<select class="input" data-select-funnel style="padding:6px 12px;min-height:36px;font-size:13px;font-weight:600;margin-right:8px;border-radius:8px">${fs.map(x=>`<option value="${x.id}" ${x.id===f.id?'selected':''}>${E(x.name)} (${x.status==='published'?'Publié':'Brouillon'})</option>`).join('')}</select>`:'';

let tabsHtml=`<div class="tabs">
  <button type="button" class="${bTab==='01'?'active':''}" data-builder-tab="01">01 Capture</button>
  <button type="button" class="${bTab==='02'?'active':''}" data-builder-tab="02">02 Présentation (VSL)</button>
  <button type="button" class="${bTab==='03'?'active':''}" data-builder-tab="03">03 Candidature</button>
  <button type="button" class="${bTab==='04'?'active':''}" data-builder-tab="04">04 Confirmation & RDV</button>
  <button type="button" class="${bTab==='curriculum'?'active':''}" data-builder-tab="curriculum">05 Programme (7 Jours)</button>
  <button type="button" class="${bTab==='legal'?'active':''}" data-builder-tab="legal">06 Légal & RGPD</button>
</div>`;

let tab01Content=`
<div class="cardhead"><div><h2>01 · Page de Capture & Marque</h2><p>Personnalisez votre accroche, vos promesses et votre identité visuelle.</p></div></div>
<label class="form-field"><span>Nom de votre marque (En-tête & Footer)</span><input name="brand_name" value="${E(theme.logo_text||f.name)}"></label>
<label class="form-field"><span>Logo du tunnel (image / URL)</span><input name="logo_url" placeholder="/assets/logo-256.png ou URL https://..." value="${E(theme.logo_url||'/assets/logo-256.png')}"><small class="mini" style="margin-top:4px;display:block;color:#888">Par défaut : le logo Nüptin. Vous pouvez aussi téléverser une image dans l'onglet Médias et coller son lien ici.</small></label>
<label class="form-field"><span>Badge en haut à droite</span><input name="badge_text" placeholder="PARCOURS OFFERT" value="${E(theme.badge_text||'PARCOURS OFFERT')}"></label>
<label class="form-field"><span>Couleur d'accentuation</span><input type="color" name="accent" value="${/^#[0-9a-f]{6}$/i.test(theme.accent)?theme.accent:'#ed613f'}" style="padding:6px;width:100px;height:46px"></label>
<label class="form-field"><span>Titre principal de la page</span><textarea name="title" required>${E(c.title||'')}</textarea></label>
<label class="form-field"><span>Accroche supérieure (Sur-titre)</span><input name="eyebrow" value="${E(c.eyebrow||'')}"></label>
<label class="form-field"><span>Sous-titre descriptif</span><textarea name="subtitle">${E(c.subtitle||'')}</textarea></label>
<label class="form-field"><span>Texte du bouton d'action (CTA Capture)</span><input name="capture_cta" value="${E(c.capture_cta||'')}"></label>
<div class="breakline"></div>
<h3>Textes & En-tête du formulaire de capture</h3>
<label class="form-field"><span>Badge du formulaire</span><input name="form_badge" value="${E(c.form_badge||'ACCÈS IMMÉDIAT')}" placeholder="ACCÈS IMMÉDIAT"></label>
<label class="form-field"><span>Titre du formulaire</span><input name="form_title" value="${E(c.form_title||'Recevoir la formation gratuitement.')}" placeholder="Recevoir la formation gratuitement."></label>
<label class="form-field"><span>Sous-titre / Description du formulaire</span><textarea name="form_desc" placeholder="Entrez vos coordonnées pour accéder immédiatement...">${E(c.form_desc||'Entrez vos coordonnées pour accéder immédiatement à la présentation.')}</textarea></label>
<div class="breakline"></div>
<h3>Libellés & Placeholders des champs</h3>
<div class="form-two">
  <label class="form-field"><span>Libellé champ Prénom</span><input name="field_label_name" value="${E(c.field_label_name||'Prénom')}" placeholder="Prénom"></label>
  <label class="form-field"><span>Indication champ Prénom (Placeholder)</span><input name="field_placeholder_name" value="${E(c.field_placeholder_name||'Votre prénom')}" placeholder="Votre prénom"></label>
</div>
<div class="form-two">
  <label class="form-field"><span>Libellé champ Email</span><input name="field_label_email" value="${E(c.field_label_email||'Email')}" placeholder="Email"></label>
  <label class="form-field"><span>Indication champ Email</span><input name="field_placeholder_email" value="${E(c.field_placeholder_email||'vous@exemple.com')}" placeholder="vous@exemple.com"></label>
</div>
<div class="form-two">
  <label class="form-field"><span>Libellé champ WhatsApp / Téléphone</span><input name="field_label_phone" value="${E(c.field_label_phone||'Numéro WhatsApp / Téléphone')}" placeholder="Numéro WhatsApp / Téléphone"></label>
  <label class="form-field"><span>Indication champ WhatsApp</span><input name="field_placeholder_phone" value="${E(c.field_placeholder_phone||'+33 6 12 34 56 78')}" placeholder="+33 6 12 34 56 78"></label>
</div>
<label class="form-field"><span>Texte d'aide sous le numéro WhatsApp</span><input name="field_help_phone" value="${E(c.field_help_phone||'Format international (ex: +33, +237, +32...)')}" placeholder="Format international (ex: +33, +237, +32...)"></label>
<div class="breakline"></div>
<h3>Consentements & RGPD du formulaire</h3>
<label class="form-field"><span>Texte du consentement marketing</span><textarea name="consent_marketing_text" style="min-height:60px">${E(c.consent_marketing_text||'J’accepte de recevoir des communications concernant cette présentation. Ce choix est facultatif.')}</textarea></label>
<label class="form-field"><span>Texte du consentement mesure publicitaire</span><textarea name="consent_measurement_text" style="min-height:60px">${E(c.consent_measurement_text||'J’autorise les mesures publicitaires facultatives selon la politique de confidentialité.')}</textarea></label>
<label class="form-field"><span>Note d'indépendance des consentements</span><input name="consent_privacy_note" value="${E(c.consent_privacy_note||'Les deux consentements sont indépendants. Vous pouvez refuser et continuer.')}"></label>
<div class="breakline"></div>
<h3>Champs du formulaire de capture (Opt-in libre)</h3>
<p class="mini" style="color:#666;margin-bottom:12px">Choisissez exactement ce que vous demandez à vos visiteurs : prénom seul, WhatsApp seul, prénom + WhatsApp, ou prénom + email. Vous n'êtes jamais obligé de combiner email et WhatsApp si vous ne le souhaitez pas.</p>
<div style="display:grid;gap:10px;background:#fcfcfb;padding:16px;border:1px solid #e7e7e4;border-radius:12px;margin-bottom:18px">
  <label class="switch"><input type="checkbox" name="field_ask_name" ${sett.fields?.ask_name!==false?'checked':''}> Demander le prénom du prospect</label>
  <label class="switch"><input type="checkbox" name="field_ask_email" ${sett.fields?.ask_email!==false?'checked':''}> Demander l'adresse email</label>
  <label class="switch"><input type="checkbox" name="field_ask_phone" ${sett.fields?.ask_phone?'checked':''}> Demander le numéro WhatsApp / Téléphone</label>
  <div style="display:flex;gap:18px;margin-top:6px;padding-top:10px;border-top:1px dashed #e2e2df;font-size:12px;color:#666;flex-wrap:wrap">
    <label class="switch" style="font-size:12px"><input type="checkbox" name="field_require_email" ${sett.fields?.require_email!==false?'checked':''}> Email obligatoire</label>
    <label class="switch" style="font-size:12px"><input type="checkbox" name="field_require_phone" ${sett.fields?.require_phone?'checked':''}> WhatsApp obligatoire</label>
  </div>
</div>
<div class="breakline"></div>
<h3>Présentateur & Avis clients</h3>
<label class="form-field"><span>Nom de l’expert ou présentateur</span><input name="speaker_name" value="${E(c.speaker_name||'')}" placeholder="Laisser vide pour masquer"></label>
<label class="form-field"><span>Titre / Rôle du présentateur</span><input name="speaker_title" value="${E(c.speaker_title||'')}" placeholder="Ex: Fondateur & Consultant"></label>
<label class="form-field"><span>Lien d'avis vérifiés (Google ou Trustpilot)</span><input name="reviews_url" value="${E(sett.reviews_url||c.reviews_url||'')}" placeholder="https://g.page/r/..."></label>
<label class="form-field"><span>Texte du badge d'avis</span><input name="reviews_badge_text" value="${E(c.reviews_badge_text||'Avis vérifiés · Note 4.9/5')}" placeholder="Avis vérifiés · Note 4.9/5"></label>
`;

let tab02Content=`
<div class="cardhead"><div><h2>02 · Présentation Vidéo (VSL)</h2><p>Paramétrez le titre, la vidéo et le déclenchement différé du bouton d'action.</p></div></div>
<label class="form-field"><span>Titre de la vidéo / masterclass</span><input name="training_title" value="${E(c.training_title||'')}"></label>
<label class="form-field"><span>Bouton sous la vidéo</span><input name="training_cta" value="${E(c.training_cta||'')}"></label>
<label class="form-field"><span>Vidéo de présentation (YouTube, Vimeo, Loom ou MP4)</span><input name="video_url" value="${E(sett.video_url||'')}" placeholder="Ex: https://www.youtube.com/watch?v=... ou /assets/app7.mp4"><small class="mini" style="display:block;margin-top:4px;color:#888">Compatible avec YouTube, Vimeo, Loom ou vos fichiers MP4 du Stockage Sécurisé.</small></label>
<label class="form-field"><span>Apparition du bouton d’action sous la vidéo</span><select name="cta_delay_seconds"><option value="0" ${String(sett.cta_delay_seconds||'0')==='0'?'selected':''}>Immédiate (dès l’ouverture)</option><option value="60" ${String(sett.cta_delay_seconds)==='60'?'selected':''}>Après 1 minute de visionnage</option><option value="180" ${String(sett.cta_delay_seconds)==='180'?'selected':''}>Après 3 minutes</option><option value="300" ${String(sett.cta_delay_seconds)==='300'?'selected':''}>Après 5 minutes</option><option value="600" ${String(sett.cta_delay_seconds)==='600'?'selected':''}>Après 10 minutes</option><option value="end" ${String(sett.cta_delay_seconds)==='end'?'selected':''}>À la fin complète de la vidéo</option></select><small class="mini" style="color:#888;display:block;margin-top:4px">Masque la candidature sous la vidéo jusqu’au moment choisi.</small></label>
<div class="breakline"></div>
<h3>Action après le visionnage (Bouton d'action CTA)</h3>
<label class="form-field"><span>Destination du bouton sous la vidéo</span>
  <select name="vsl_cta_action">
    <option value="candidature" ${sett.vsl_cta_action!=='whatsapp_group'&&sett.vsl_cta_action!=='whatsapp_direct'?'selected':''}>03 · Candidature & Qualification (Parcours standard)</option>
    <option value="whatsapp_group" ${sett.vsl_cta_action==='whatsapp_group'?'selected':''}>Rejoindre le groupe WhatsApp dédié</option>
    <option value="whatsapp_direct" ${sett.vsl_cta_action==='whatsapp_direct'?'selected':''}>Discuter directement sur WhatsApp</option>
  </select>
</label>
<label class="form-field"><span>Lien d'invitation du groupe WhatsApp (si groupe sélectionné)</span>
  <input name="whatsapp_group_link" value="${E(sett.whatsapp_group_link||'')}" placeholder="https://chat.whatsapp.com/... ou JID du groupe">
  <small class="mini" style="color:#888;display:block;margin-top:3px">Permet aux prospects de rejoindre votre communauté WhatsApp directement après la vidéo.</small>
</label>
<label class="form-field"><span>Numéro WhatsApp direct (si discussion directe sélectionnée)</span>
  <input name="whatsapp_direct_phone" value="${E(sett.whatsapp_direct_phone||'')}" placeholder="+33612345678">
</label>
<label class="form-field"><span>Message pré-rempli pour la discussion WhatsApp</span>
  <input name="whatsapp_direct_message" value="${E(sett.whatsapp_direct_message||'Bonjour, je viens de voir votre présentation et je souhaite échanger !')}" placeholder="Bonjour...">
</label>
`;

let tab03Content=`
<div class="cardhead"><div><h2>03 · Page de Candidature & Qualification</h2><p>Personnalisez les questions, titres et réassurance pour qualifier vos prospects.</p></div></div>
<label class="form-field"><span>Sur-titre de la page</span><input name="app_eyebrow" value="${E(c.app_eyebrow||'ÉTAPE 03 · VOTRE PROJET')}" placeholder="ÉTAPE 03 · VOTRE PROJET"></label>
<label class="form-field"><span>Titre principal de la candidature</span><input name="app_title" value="${E(c.app_title||'Maintenant, parlons de votre idée.')}" placeholder="Maintenant, parlons de votre idée."></label>
<label class="form-field"><span>Sous-titre explicatif</span><textarea name="app_subtitle" placeholder="Une application commence par un problème clair, pas par cent fonctionnalités...">${E(c.app_subtitle||'Une application commence par un problème clair, pas par cent fonctionnalités. Quelques réponses suffisent pour préparer la suite.')}</textarea></label>
<label class="form-field"><span>Citation inspirante / Réassurance</span><textarea name="app_quote" placeholder="Ne vous contentez plus de demander à l’IA...">${E(c.app_quote||'Ne vous contentez plus de demander à l’IA ce qu’elle peut faire. Apprenez à lui faire construire ce que vous avez imaginé.')}</textarea></label>
<div class="breakline"></div>
<h3>Formulaire de qualification</h3>
<label class="form-field"><span>Badge au-dessus du formulaire</span><input name="app_badge" value="${E(c.app_badge||'PROJET APP 7')}" placeholder="PROJET APP 7"></label>
<label class="form-field"><span>Titre de la boîte formulaire</span><input name="app_form_title" value="${E(c.app_form_title||'Présentez votre projet.')}" placeholder="Présentez votre projet."></label>
<label class="form-field"><span>Description sous le titre</span><input name="app_form_desc" value="${E(c.app_form_desc||'Les réponses seront enregistrées dans le CRM du programme.')}" placeholder="Les réponses seront enregistrées dans le CRM du programme."></label>
<label class="form-field"><span>Libellé Question 1 (Stade d’avancement)</span><input name="app_question_stage" value="${E(c.app_question_stage||'Où en êtes-vous ?')}" placeholder="Où en êtes-vous ?"></label>
<label class="form-field"><span>Libellé Question 2 (Catégorie)</span><input name="app_question_category" value="${E(c.app_question_category||'Catégorie (facultatif)')}" placeholder="Catégorie (facultatif)"></label>
<label class="form-field"><span>Libellé Question 3 (Description)</span><input name="app_question_message" value="${E(c.app_question_message||'Décrivez votre idée (facultatif)')}" placeholder="Décrivez votre idée (facultatif)"></label>
<label class="form-field"><span>Texte indicatif du champ de description (Placeholder)</span><input name="app_placeholder" value="${E(c.app_placeholder||'À qui servira votre application ? Quel problème résoudra-t-elle ?')}" placeholder="À qui servira votre application ?"></label>
<label class="form-field"><span>Texte du bouton de validation (CTA)</span><input name="app_cta" value="${E(c.app_cta||'Envoyer mon projet')}" placeholder="Envoyer mon projet"></label>
<div class="breakline"></div>
<h3>Action après soumission du projet</h3>
<p class="mini" style="color:#666;margin-bottom:12px">Choisissez ce que découvre le candidat une fois son projet validé :</p>
<label class="form-field"><span>Redirection après validation du projet</span>
  <select name="after_app_action">
    <option value="default" ${(sett.after_app_action||'default')==='default'?'selected':''}>Parcours standard (Prise de RDV si activée, sinon page de confirmation)</option>
    <option value="whatsapp_group" ${sett.after_app_action==='whatsapp_group'?'selected':''}>Invitation directe à rejoindre le groupe WhatsApp VIP</option>
  </select>
</label>
<label class="form-field"><span>Lien d'invitation au groupe WhatsApp (si sélectionné)</span>
  <input name="after_app_whatsapp_link" value="${E(sett.after_app_whatsapp_link||sett.whatsapp_group_link||'')}" placeholder="https://chat.whatsapp.com/...">
</label>
`;

let tab04Content=`
<div class="cardhead"><div><h2>04 · Confirmation & Prise de Rendez-vous</h2><p>Gérez le module de calendrier (Cal.com) et les remerciements après candidature.</p></div></div>
<label class="switch" style="margin-bottom:16px"><input type="checkbox" name="booking_enabled" ${sett.booking_enabled?'checked':''}> Activer le module de prise de rendez-vous sur ce tunnel</label>
<p class="mini" style="color:#666;margin-bottom:16px">Si activé, le prospect choisit son créneau immédiatement après avoir postulé. Vous pouvez synchroniser Cal.com dans l'onglet Intégrations.</p>
<div class="breakline"></div>
<h3>Page de remerciement (Confirmation)</h3>
<label class="form-field"><span>Sur-titre de confirmation</span><input name="thank_eyebrow" value="${E(c.thank_eyebrow||'DEMANDE ENREGISTRÉE')}" placeholder="DEMANDE ENREGISTRÉE"></label>
<label class="form-field"><span>Titre de remerciement</span><input name="thank_you" value="${E(c.thank_you||'Votre projet commence maintenant.')}" placeholder="Votre projet commence maintenant."></label>
<label class="form-field"><span>Message explicatif</span><textarea name="thank_desc" placeholder="Votre inscription et vos réponses ont été enregistrées avec succès...">${E(c.thank_desc||'Votre inscription et vos réponses ont été enregistrées avec succès. Choisissez votre créneau d’échange ci-dessous directement sans quitter le site :')}</textarea></label>
<label class="form-field"><span>Bouton retour</span><input name="thank_back_btn" value="${E(c.thank_back_btn||'Revoir la présentation')}" placeholder="Revoir la présentation"></label>
`;

let tabCurriculumContent=`
<div class="cardhead"><div><h2>05 · Programme & Parcours par Étapes (7 Jours)</h2><p>Structurez votre formation ou accompagnement en étapes concrètes.</p></div></div>
<label class="switch"><input type="checkbox" name="show_program_details" ${sett.show_program_details!==false?'checked':''}> Afficher la section « Le Programme en détail » sur le tunnel public</label>
<div style="margin-top:14px">
  <label class="form-field"><span>Sur-titre de la section</span><input name="curriculum_eyebrow" value="${E(c.curriculum_eyebrow||'LE PROGRAMME EN DÉTAIL')}"></label>
  <label class="form-field"><span>Titre principal de la section</span><input name="curriculum_title" value="${E(c.curriculum_title||'Un parcours étape par étape.')}"></label>
  <label class="form-field"><span>Description de la section</span><textarea name="curriculum_desc">${E(c.curriculum_desc||'Sept étapes logiques et structurées : cadrer, construire, vérifier et préparer la commercialisation.')}</textarea></label>
</div>
<div style="display:flex;flex-direction:column;gap:12px;margin-top:14px">${((f.draft?.days&&Array.isArray(f.draft.days)&&f.draft.days.length)?f.draft.days:[{day:'01',title:'Clarifier',sub:'Idée & Vision',icon:'',image:'',status:'available',enabled:true},{day:'02',title:'Dessiner',sub:'UX/UI & Parcours',icon:'',image:'',status:'available',enabled:true},{day:'03',title:'Construire',sub:'Fonctions & IA',icon:'',image:'',status:'available',enabled:true},{day:'04',title:'Structurer',sub:'Données & BDD',icon:'',image:'',status:'available',enabled:true},{day:'05',title:'Monétiser',sub:'Offre & Pricing',icon:'',image:'',status:'available',enabled:true},{day:'06',title:'Publier',sub:'Tests & Sécurité',icon:'',image:'',status:'available',enabled:true},{day:'07',title:'Lancer',sub:'Utilisateurs & Croissance',icon:'',image:'',status:'available',enabled:true}]).map((d,i)=>`<div class="card pad" style="background:#fcfcfb;border:1px solid #e7e7e4;padding:15px;border-radius:14px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><strong style="font-size:12px;color:var(--orange)">ÉTAPE ${E(d.day||'0'+(i+1))}</strong><label class="switch" style="font-size:11px;padding:0"><input type="checkbox" name="day_${i}_enabled" ${d.enabled!==false?'checked':''}> Activer cette étape</label></div><div class="form-two"><label class="form-field" style="margin-bottom:8px"><span>Titre</span><input name="day_${i}_title" value="${E(d.title||'')}"></label><label class="form-field" style="margin-bottom:8px"><span>Sous-titre / Focus</span><input name="day_${i}_sub" value="${E(d.sub||'')}"></label></div><div class="form-two"><label class="form-field" style="margin-bottom:8px"><span>Symbole ou texte court (Optionnel)</span><input name="day_${i}_icon" value="${E(d.icon||'')}" placeholder="Ex: 01 ou vide"></label><label class="form-field" style="margin-bottom:8px"><span>Statut</span><select name="day_${i}_status"><option value="available" ${d.status==='available'?'selected':''}>Disponible / Validé</option><option value="in_progress" ${d.status==='in_progress'?'selected':''}>En direct / En cours</option><option value="upcoming" ${d.status==='upcoming'?'selected':''}>À venir / Bientôt</option></select></label></div><label class="form-field" style="margin-bottom:0"><span>Image personnalisée (URL optionnelle pour remplacer l’icône)</span><input type="url" name="day_${i}_image" value="${E(d.image||'')}" placeholder="https://... ou URL média stocké"></label></div>`).join('')}</div>
`;

let tabLegalContent=`
<div class="cardhead"><div><h2>06 · Mentions Légales & Conformité RGPD</h2><p>Générateur juridique automatique de Mentions Légales, Politique de Confidentialité et CGV.</p></div></div>
<label class="form-field"><span>Raison sociale / Nom de la société légale</span><input name="legal_company_name" value="${E(leg.company_name||'')}" placeholder="Ex: Jupille Group Ltd ou Mon Entreprise SAS"></label>
<label class="form-field"><span>Adresse du siège social</span><input name="legal_address" value="${E(leg.address||'')}" placeholder="Ex: 26 Surcouf Avenue, 72350 Quatre Bornes, Maurice"></label>
<label class="form-field"><span>Numéro d'immatriculation (BRN / SIRET / RCS)</span><input name="legal_registration" value="${E(leg.registration||'')}" placeholder="Ex: BRN 22191318 ou SIRET 912 345 678 00012"></label>
<label class="form-field"><span>Numéro de TVA</span><input name="legal_vat" value="${E(leg.vat||'')}" placeholder="Ex: TVA 28079169 ou FR 12 345678901"></label>
<label class="form-field"><span>Capital social</span><input name="legal_capital" value="${E(leg.capital||'')}" placeholder="Ex: 20 000 €"></label>
<label class="form-field"><span>Email de contact juridique & support</span><input type="email" name="legal_email" value="${E(leg.email||'')}" placeholder="Ex: info@remy-jupille.com"></label>
<label class="form-field"><span>Directeur de la publication</span><input name="legal_director" value="${E(leg.director||'')}" placeholder="Ex: Rémy Jupille ou Lionel Tagne"></label>
<label class="form-field"><span>Hébergeur du site</span><input name="legal_host" value="${E(leg.host||'')}" placeholder="Ex: ClickFunnels (Etison LLC, 3443 W. Bavaria St., Eagle, Idaho 83646, USA)"></label>
<label class="form-field"><span>Droit applicable & Tribunaux compétents</span><input name="legal_jurisdiction" value="${E(leg.jurisdiction||'')}" placeholder="Ex: Droit Mauricien / Tribunaux compétents de Maurice ou Droit Français / Paris"></label>
<label class="form-field"><span>Avertissement sur les résultats (Earnings Disclaimer)</span><textarea name="legal_disclaimer" style="min-height:90px" placeholder="Laisser vide pour utiliser le texte standard de non-garantie de gains...">${E(leg.disclaimer||'')}</textarea><small class="mini" style="color:#888;display:block;margin-top:4px">Affiché en bas de chaque page du tunnel.</small></label>
<div class="breakline"></div>
<h3>Liens Légaux Externes (Optionnel)</h3>
<p class="mini" style="color:#777;margin-bottom:14px">Si vous possédez déjà vos propres pages légales hébergées en externe, renseignez leurs URLs ci-dessous. Sinon, laissez vide : le système utilisera le lecteur haute conformité intégré.</p>
<label class="form-field"><span>URL externe CGV</span><input type="url" name="custom_cgv_url" value="${E(leg.cgv_url||'')}" placeholder="https://votresite.com/cgv"></label>
<label class="form-field"><span>URL externe Confidentialité</span><input type="url" name="custom_privacy_url" value="${E(leg.privacy_url||'')}" placeholder="https://votresite.com/confidentialites"></label>
<label class="form-field"><span>URL externe Mentions Légales</span><input type="url" name="custom_mentions_url" value="${E(leg.mentions_url||'')}" placeholder="https://votresite.com/mentions"></label>
`;

let currentActiveContent = bTab==='02'?tab02Content:bTab==='03'?tab03Content:bTab==='04'?tab04Content:bTab==='curriculum'?tabCurriculumContent:bTab==='legal'?tabLegalContent:tab01Content;

return head('Éditeur de Tunnel',`Personnalisation en direct : ${E(f.name)}`,switcher+`<button data-action="savebuilder" class="btn primary">Enregistrer</button><button data-publish="${f.id}" class="btn dark">Publier en ligne ↗</button>`)+
tabsHtml+
`<div class="builder">
  <section class="card pad">
    <form id="builder-form" data-fid="${f.id}">
      ${currentActiveContent}
      <button type="submit" class="btn primary" style="margin-top:16px">Sauvegarder les modifications</button>
    </form>
    <div class="breakline"></div>
    <p class="help">La publication met votre version finale en ligne instantanément. Les modifications en cours restent privées tant que vous ne publiez pas.</p>
  </section>
  <section>
    <div class="preview">
      ${bTab==='03'?`
        <span class="overline">${E(c.app_eyebrow||'ÉTAPE 03 · VOTRE PROJET')}</span>
        <h2>${E(c.app_title||'Maintenant, parlons de votre idée.')}</h2>
        <p>${E(c.app_subtitle||'Une application commence par un problème clair, pas par cent fonctionnalités.')}</p>
        <div class="fakeform">
          <div class="fakefield">${E(c.app_question_stage||'Où en êtes-vous ?')}</div>
          <div class="fakefield">${E(c.app_question_category||'Catégorie')}</div>
          <div class="fakebtn" style="background:${E(theme.accent||'#f1653b')}">${E(c.app_cta||'Envoyer mon projet')} →</div>
        </div>
      `:bTab==='04'?`
        <span class="overline">${E(c.thank_eyebrow||'DEMANDE ENREGISTRÉE')}</span>
        <h2>${E(c.thank_you||'Votre projet commence maintenant.')}</h2>
        <p>${E(c.thank_desc||'Vos réponses ont été enregistrées. Choisissez votre créneau ci-dessous.')}</p>
        <div class="fakeform">
          <div class="fakefield">Calendrier des créneaux synchronisé</div>
          <div class="fakebtn" style="background:#202322">Confirmer mon créneau →</div>
        </div>
      `:bTab==='02'?`
        <span class="overline">VOTRE PRÉSENTATION OFFERTE</span>
        <h2>${E(c.training_title||'Une idée. Sept jours. Votre application.')}</h2>
        <p>Présentation guidée et vidéo VSL active.</p>
        <div class="fakeform">
          <div class="fakefield" style="background:#000;color:#fff;text-align:center;padding:18px">▶ Lecteur Vidéo VSL</div>
          ${sett.vsl_cta_action==='whatsapp_group'?`<div class="fakebtn" style="background:#25D366;color:#fff">Rejoindre le groupe WhatsApp →</div>`:sett.vsl_cta_action==='whatsapp_direct'?`<div class="fakebtn" style="background:#25D366;color:#fff">Discuter sur WhatsApp →</div>`:`<div class="fakebtn" style="background:${E(theme.accent||'#f1653b')}">${E(c.training_cta||'Déposer ma candidature')} →</div>`}
        </div>
      `:`
        <span class="overline" id="pre-eyebrow">${E(c.eyebrow||'')}</span>
        <h2 id="pre-title">${E(c.title||'')}</h2>
        <p id="pre-subtitle">${E(c.subtitle||'')}</p>
        <div class="fakeform">
          ${sett.fields?.ask_name!==false?'<div class="fakefield">Votre prénom</div>':''}
          ${sett.fields?.ask_email!==false?'<div class="fakefield">Votre adresse email</div>':''}
          ${sett.fields?.ask_phone?'<div class="fakefield">Votre WhatsApp (+33...)</div>':''}
          <div class="fakebtn" id="pre-cta" style="background:${E(theme.accent||'#f1653b')}">${E(c.capture_cta||'Continuer')} →</div>
        </div>
      `}
    </div>
    <div class="card pad" style="margin-top:14px">
      <div class="cardhead">
        <div><h2>Diffusion & Lien public</h2><p>Adresse directe de votre entonnoir</p></div>
        ${pillStatus(f.status)}
      </div>
      <div class="copylink">${location.origin}/f/${E(f.slug)}</div>
      <div class="editor-actions" style="margin-top:14px">
        <button data-action="copyurl" class="btn" data-slug="${E(f.slug)}">Copier le lien</button>
        ${f.status==='published'?`<a class="btn" target="_blank" href="/f/${E(f.slug)}">Ouvrir la page ↗</a><button class="btn" data-unpublish="${f.id}">Mettre hors ligne</button>`:''}
      </div>
    </div>
  </section>
</div>`;
}
