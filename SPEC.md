# サイト仕様書

「Quiet Strength — 静かなる強さ」をコンセプトとしたポートフォリオサイト。
（2026-09-18 に giats.me 再現版から全面リニューアル。動きの実装・技術基盤は giats.me 再現時のものを流用）
このファイルは指示があるたびに追加・更新する。

最終更新: 2026-09-24

## コンセプト

- Quiet Strength — 静かなる強さ／「静かに学び、丁寧につくる」
- Design方針: Strong Grid × Generous White Space、Minimal & Meaningful、大きなタイポグラフィ、余白を大胆に、線・番号・アクセントは意味のあるものだけ、アニメーションは控えめだが意味を持たせる

## 技術スタック

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Lenis（慣性スムーズスクロール）
- フォント: **Inter + Noto Sans JP**（Google Fonts、`index.html`でpreconnect+リンク）

## カラー

`src/index.css` の `@theme` でトークン化（Deep Navy × Warm White × Muted Blue）。

- `--color-cream` (`#f7f4ee`) = Warm White（背景）
- `--color-ink` (`#182338`) = Deep Navy（テキスト・ダークセクション背景）
- `--color-accent` (`#fbfaf6`) = 明るいピル背景
- `--color-lime` (`#7c93ac`) = Muted Blue（アクセント・ホバー時のボール展開色）

## 全体ルール

- **Git**: 自動でコミット・プッシュしない。ユーザーから明示的に指示があった場合のみ行う。
- **リンク**: 現時点では全て `href="#"` + `preventDefault` で無効化（本番リンク未確定のため）。
- **公開範囲**: 他者やGoogleにサイトを参照されないよう `robots.txt` と `noindex` メタタグで検索エンジン・クローラーをブロックする。Basic認証などのアクセス制限は不要。

## お問い合わせ機能

- **Formspree** を使用する。
- Formspreeの直リンク（フォームのaction URLを直接embed）を使う方式。Vercelのサーバーレス関数等との連携は不要。
- ステータス: **実装済み**。エンドポイント `https://formspree.io/f/xqpabozo` を `src/components/ContactForm.tsx` の `FORMSPREE_ENDPOINT` に設定済み（2026-09-24）。
- Contactセクション（`src/components/Contact.tsx`）に設置。他セクションより見せ方を強め（大見出し＋ダーク背景）にしている。

## レスポンシブ対応

- PC・SP（スマートフォン）両対応。
- ブレークポイント: `nav:` = 812px以上をPCレイアウトとする。

## デプロイ方法

- **Vercel** を使用する。
- ステータス: **未実施**。ユーザーからの明示的な指示があった場合のみデプロイ作業を行う。

## SEO / 公開範囲制御

- ステータス: **実装済み**
  - `public/robots.txt` で全クローラーを `Disallow: /`
  - `index.html` に `<meta name="robots" content="noindex, nofollow">`

## セクション構成・演出仕様（実装済み）

1. **Loader** (`Loader.tsx`): 「Quiet Strength」→「静かに、積み重ねる。」切り替え＋0-100%カウンター。
2. **Header** (`Header.tsx`): 固定ヘッダー、ロード完了後にフェードイン。「Portfolio」ロゴ／Contactピルボタン／Menuボタン。
3. **Hero** (`Hero.tsx`): ミニマルな構成。アイコピー「FRONT-END DEVELOPER」＋大見出し「Quiet Strength」＋「静かに、積み重ねる。」。過去のギラつく3Dパネル演出は削除。SCROLLインジケーターは2026-09-24に削除済み。
   - 2026-09-24: 「FVが寂しい」とのフィードバックにより、`HeroBackground.tsx`（テキスト背後の○□△の図形4つ）を追加。
     - 当初はぼかした光の玉（blur blob）で実装 →「あまり良いデザインでない」→ About/Philosophy/Profileと同じ線画の図形言語に統一（不透明度18%の薄い線のみ）→「改善されていない（薄すぎて静止時に見えない）」というフィードバックを経て、**右上に大きな塗りつぶし円（画面幅24%、静止時の存在感の核）＋濃いめの線（不透明度45%）の三角形・四角形＋控えめな小円**という構成に調整。
     - 当初は`pointermove`によるマウス追従だったが、「同じくらいの可動域で自動的に動かしてほしい」との指示により、マウス追従をやめ**CSS keyframes（`animate-hero-drift-a/b/c/d`、11〜20秒周期でそれぞれ違うタイミングでゆっくり漂う）による自動アニメーション**に変更。移動幅はマウス追従時と同程度（各図形30〜70px）に揃えている。
4. **About** (`About.tsx`): 「01 ABOUT」。異業種からキャリアチェンジ／半年間フロントエンドエンジニア養成科で学習／卒業間近、というストーリー。右に幾何学パネル（`GeometricPanel.tsx`、人物写真は使わない方針のため採用。詳細は本ファイル下部「写真枠の方針」参照）。
5. **ScrollQuote** (`ScrollQuote.tsx`): 「できることを、ひとつずつ増やしてきました。」を表示。高さ180vh（giats版の260vhから短縮）。テキストは画面中央にsticky固定。各単語は手前側（やや大きく・ぼやけた状態）から出現し、スクロールに連動して縮小・鮮明化しながら定位置へ収まる（初期状態は完全に不可視）。**Quiet Strengthのトーンに合わせて散らばり距離・ぼかし量・拡大率を大幅に控えめ**に調整済み（giats版の半分以下の強度）。
6. **Skills** (`Skills.tsx`): 「02 SKILLS」。HTML/CSS/JavaScript/TypeScript/React/Tailwind CSS/Git・GitHub/Figmaを2カラムのナンバリングリストで表示。スクロールで軽いscale+blur+fadeイン（giats版の吊り下げバッジより大幅に控えめ）。
7. **Works** (`Works.tsx`, 旧Projects): 「03 WORKS」。カード（`WorkSlideCard.tsx`、作品カラー＋画像＋タイトル＋タグ）が右から左へ**継続的に横スライドするマーキー**（`animate-works-scroll`、52s linear infinite、ホバーで一時停止）。配列を2セット並べて継ぎ目なくループ。
   - 2026-09-24: 実際に掲載する作品は最大3件の想定のため、カード幅・余白を拡大（w-56/16vw→w-72/24vw、gap-8/2vw→gap-14/5vw）し、アニメーション速度もカードサイズに合わせて減速（32s→52s）。
   - 2026-09-24: 従来の「吊り下げ式IDバッジ＋クリームのメモカード」（`WorkBadge.tsx` / `WorkNoteCard.tsx`）は giats.me のClientsセクションと酷似しすぎているとのフィードバックにより廃止。代わりに https://syuzgen.com/ のトップにあるスライド演出（`loop-track`クラスで横に流れるカード）を参考に、独自の配色・カード内容で再構築（両コンポーネントは削除済み）。
   - カードの画像は`WorkSlideCard.tsx`の`image`prop（例: `/images/works/project-01.jpg`）。未指定時は「Coming soon」表示。
   - プレースホルダー3件（Project 01-03）。**実際の制作物・スクリーンショットへの差し替えが必要**。
8. **Philosophy** (`Philosophy.tsx`): 「04 PHILOSOPHY」。見出し「大切にしていること。」＋THINK/考える→BUILD/つくる→IMPROVE/磨くの3ステップを3カラムで表示。Quiet Strengthを最も強く表現するセクション。
   - 2026-09-24: 「少しだけ派手に」とのフィードバックにより、各ステップにMuted Blueの図形アイコン（○THINK／□BUILD／△IMPROVE、スクロールでscale+回転しながら出現）と、同色のアクセント罫線（`border-t-2`）を追加。Aboutの`GeometricPanel.tsx`と図形の言語を揃えている。
9. **Profile** (`Profile.tsx`): 「05 PROFILE」。氏名・肩書き・写真枠（`PersonalityPanel.tsx`）・人柄紹介文（**氏名「Your Name」・紹介文はプレースホルダー、要差し替え**）。
10. **Contact** (`Contact.tsx`, 旧CTA): ダーク背景、大見出し「丁寧に、向き合います。」＋ContactForm（Formspree連携済み: `xqpabozo`）。（2026-09-24: 見出しは元々「はじめの一歩を、一緒に。」だったが、「静かに」を多用している点も踏まえ変更）
11. **Footer** (`Footer.tsx`): Sitemap（Home/About/Skills/Works/Philosophy/Profile）／Contact（メールアドレスはプレースホルダー）／タグライン／Go to topボタン。（2026-09-24: Follow列（GitHub/X/Email）はユーザー指示により削除）
12. **メニューオーバーレイ** (`MenuOverlay.tsx`): 右からダークパネルがスライドイン。背景コンテンツは縮小＋角丸＋左シフト。Navigation／Followの2カラム構成。

### 流用した動きの技術（giats.me再現時に実装したもの）

Lenis慣性スクロール／RevealText（下から単語出現）／ScrollQuote（手前から集まり定位置に収まる、強度は控えめに調整）／ボタンホバーのボール展開／Footerリンクのホバー矢印／メニュー開閉時の背景縮小+角丸／カスタムスクロールバー／ヘッダーのフェードイン。

### giats.me再現版から削除・不採用にしたもの

- BackgroundScene（画面全体に漂うグラデーションブロブのcanvas背景）— Quiet Strengthのミニマル方針にそぐわないため削除
- Heroの光る球体パネル演出 — 同上
- Clientsセクションの「吊り下げ式IDバッジ」＋常時swayアニメーション — Skillsセクションへの転用は見送り、一時Worksセクションへ採用したが、2026-09-24に「参考サイトと酷似しすぎている」とのフィードバックによりWorksからも廃止（横スライドのカードマーキーに置き換え。詳細はWorksの項目参照）
- Footerの巨大ブランドワードマーク — 意味のないアクセントを避ける方針のため、タグライン程度の控えめな表現に変更
- PillButton・見出しのuppercase強制 — 静かなトーンに合わせ通常表記に変更

### 文章（コピー）の方針（2026-09-24決定）

「企業に送る就職活動用ポートフォリオとして違和感のない文章」を基準に、サイト全体の文章を見直した。

- 「静かに」という単語を多用しすぎていた（Hero／ScrollQuote／Philosophy／Profile／Footerで重複）ため、**Heroのタグライン「静かに、積み重ねる。」（Loaderでも同じ文言を使用）の1箇所のみに絞り**、他は言い換え（着実に／一歩ずつ／誠実に　など）に変更。
- Contactの案内文はフリーランスの営業文的な「お気軽にご相談ください」調をやめ、「ご質問やお問い合わせは、下記フォームよりお気軽にご連絡ください。」という企業への問い合わせ導線として自然な言い回しに変更。
- ContactFormの入力欄・送信ボタンを英語（Your name / Send message）から日本語（お名前 / 送信する）に変更。
- About本文を簡潔化（同じ内容を2文で繰り返していた箇所を整理）。
- Works（作品）のプレースホルダー説明文を「制作中。目的・工夫点などをここに記載予定。」（内部メモ的な文体）から「現在制作中です。完成次第、制作の目的や工夫した点を掲載します。」（閲覧者向けの文体）に変更。

### 句読点の方針（2026-09-24決定）

ユーザー指示により、**サイト表示テキストから句読点（「、」「。」）を全て削除**（コード内のコメントは対象外）。見出し・本文・フォームのメッセージなど、UIに表示される日本語テキスト全てが対象。今後、新しく日本語テキストを追加する際も句読点なしで統一する。

## 未確定・保留事項（要ユーザー入力）

- Vercelデプロイのタイミング・ドメイン
- Works（作品）の実際のコンテンツ・画像・下層ページ
- Profileの氏名・紹介文
- Footer/メニューのSNS・メールの実リンク先
- Git: 2026-09-24にローカルリポジトリを初期化し最初のコミットを作成。リモート（GitHub等）は未接続

### 写真枠の方針（2026-09-24決定・更新）

ユーザーは自身の顔写真を掲載したくない意向。当初は両方とも同じ抽象グラデーションパネル（`GradientPanel.tsx`）にしたが、「味気ない」「2箇所は別デザインに」とのフィードバックを受け、**動きのある2種類の異なる装飾**に変更（`GradientPanel.tsx`は削除）。

- **About**: `GeometricPanel.tsx` — Muted Blueの円＋アウトラインの三角形（ゆっくり回転、`animate-spin-slow`18s linear infinite）＋アクセントの円弧と小さな点（`animate-pulse-soft`）を組み合わせた幾何学モチーフ。syuz'gen（Works参考サイト）の図形づかいとトーンを揃えつつ、より存在感のある見た目に。
  - 2026-09-24: 当初は折れ線グラフ（`GrowthLinePanel.tsx`、不採用）→波紋モチーフ（`RipplePanel.tsx`）としたが、「もう少し派手さが欲しい」とのフィードバックにより現在の幾何学パネルに変更（両コンポーネントとも削除済み）。
- **Profile**: `PersonalityPanel.tsx` — 柔らかい光のにじみ（`animate-orbit-a`）＋ゆっくり逆回転するダイヤ形（角丸正方形、`animate-spin-slow-reverse`22s linear infinite）＋アクセントの点（`animate-pulse-soft`）。About（円＋三角形の順回転）と図形の言語・要素数を揃えつつ、回転方向を逆にして差別化。
  - 2026-09-24: 初期実装（`OrbitPanel.tsx`、漂う光の玉3つのみ）は地味な印象だったため、Aboutの`GeometricPanel.tsx`と同系統の幾何学モチーフに変更。ただしPhilosophyで「要素を詰め込みすぎ」と指摘された反省を踏まえ、要素数は3つ（にじみ・図形・点）に絞っている（`OrbitPanel.tsx`は削除済み）。

動きの強度は「はっきり分かる程度に・ただし急かされる速さにはしない」を基準に調整し、Quiet Strengthのトーンを崩さないようにしている。他の装飾案（巨大ゴースト数字、ドット/グリッド柄）も検討したが不採用。
