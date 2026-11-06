import os
import sys
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # Blank slide layout

    # Brand Colors
    EMERALD_DARK = RGBColor(15, 61, 55)     # #0F3D37
    EMERALD_DEEP = RGBColor(8, 38, 34)      # #082622
    GOLD = RGBColor(212, 175, 124)          # #D4AF7C
    GOLD_LIGHT = RGBColor(245, 232, 215)    # Soft champagne
    CREAM = RGBColor(247, 245, 237)         # #F7F5ED
    CHARCOAL = RGBColor(26, 26, 26)         # #1A1A1A
    WHITE = RGBColor(255, 255, 255)
    GRAY_TEXT = RGBColor(85, 95, 95)
    GRAY_LIGHT = RGBColor(238, 241, 239)
    CARD_BG = RGBColor(255, 255, 255)
    CARD_BORDER = RGBColor(215, 222, 218)
    ROSE = RGBColor(185, 65, 55)
    GREEN_SUCCESS = RGBColor(35, 130, 80)

    # Assets
    public_dir = os.path.join(os.path.dirname(__file__), "frontend", "public")
    hero_couple_img = os.path.join(public_dir, "manmitra-couple-hero.png")
    romantic_hero_img = os.path.join(public_dir, "manmitra-romantic-couple-hero.jpg")
    app_icon_img = os.path.join(public_dir, "manmitra-app-icon.png")
    logo_dark_img = os.path.join(public_dir, "manmitra-logo-dark.png")
    symbol_img = os.path.join(public_dir, "manmitra-symbol.png")

    def add_header(slide, title, category="MAANMITRA PLATFORM ARCHITECTURE", is_dark=False):
        # Header banner or top bar
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(11.7), Inches(0.35))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        tf_cat.margin_left = tf_cat.margin_top = tf_cat.margin_right = tf_cat.margin_bottom = 0
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.name = "Trebuchet MS"
        p_cat.font.color.rgb = GOLD if is_dark else EMERALD_DARK

        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.75), Inches(11.7), Inches(0.65))
        tf_t = title_box.text_frame
        tf_t.word_wrap = True
        tf_t.margin_left = tf_t.margin_top = tf_t.margin_right = tf_t.margin_bottom = 0
        p_t = tf_t.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(24)
        p_t.font.bold = True
        p_t.font.name = "Georgia"
        p_t.font.color.rgb = WHITE if is_dark else CHARCOAL

    def create_card(slide, left, top, width, height, bg_color=CARD_BG, border_color=CARD_BORDER):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = bg_color
        if border_color:
            shape.line.color.rgb = border_color
            shape.line.width = Pt(1.2)
        else:
            shape.line.fill.background()
        return shape

    def set_slide_background(slide, color):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = color
        bg.line.fill.background()
        return bg

    # =========================================================================
    # SLIDE 1: TITLE SLIDE (Cover)
    # =========================================================================
    slide1 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide1, EMERALD_DEEP)

    # Decorative Gold Line
    line = slide1.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.0), Inches(2.5), Inches(0.06))
    line.fill.solid()
    line.fill.fore_color.rgb = GOLD
    line.line.fill.background()

    # Title & Subtitle Box
    t_box = slide1.shapes.add_textbox(Inches(0.8), Inches(1.3), Inches(7.5), Inches(3.2))
    tf1 = t_box.text_frame
    tf1.word_wrap = True
    
    p0 = tf1.paragraphs[0]
    p0.text = "MAANMITRA"
    p0.font.size = Pt(46)
    p0.font.bold = True
    p0.font.name = "Georgia"
    p0.font.color.rgb = WHITE

    p1 = tf1.add_paragraph()
    p1.text = "A Listening Friend, Always With You"
    p1.font.size = Pt(22)
    p1.font.bold = True
    p1.font.name = "Trebuchet MS"
    p1.font.color.rgb = GOLD
    p1.space_before = Pt(8)

    p2 = tf1.add_paragraph()
    p2.text = "Comprehensive End-to-End Project Documentation, System Architecture, & Operational Workflows for Modern Consensual Co-habitation & Relationship Wellness"
    p2.font.size = Pt(13)
    p2.font.name = "Calibri"
    p2.font.color.rgb = RGBColor(220, 230, 226)
    p2.space_before = Pt(16)

    # Metadata card on bottom left
    card1 = create_card(slide1, Inches(0.8), Inches(4.9), Inches(7.2), Inches(1.8), bg_color=EMERALD_DARK, border_color=GOLD)
    meta_box = slide1.shapes.add_textbox(Inches(1.1), Inches(5.1), Inches(6.6), Inches(1.4))
    tf_meta = meta_box.text_frame
    tf_meta.word_wrap = True
    
    pm1 = tf_meta.paragraphs[0]
    pm1.text = "PLATFORM METRICS & HIGHLIGHTS"
    pm1.font.size = Pt(11)
    pm1.font.bold = True
    pm1.font.color.rgb = GOLD

    pm2 = tf_meta.add_paragraph()
    pm2.text = "• Full-Stack Architecture: React 18 (Vite) + FastAPI (Python 3.11) + SQLAlchemy 2.0\n• Real-Time Engine: Native WebSockets with Multi-Client Broadcasting & Daily Quotas\n• Monetization: 2-Tier Model (Basic ₹499 / Premium ₹999) + Razorpay Verification\n• Safety: Zero Public Phone Numbers, 18+ Verification & Clinical Practitioner Review"
    pm2.font.size = Pt(11)
    pm2.font.color.rgb = WHITE
    pm2.space_before = Pt(4)

    # Right Side Hero Card with Image
    if os.path.exists(hero_couple_img):
        create_card(slide1, Inches(8.5), Inches(1.2), Inches(4.0), Inches(5.5), bg_color=EMERALD_DARK, border_color=GOLD)
        slide1.shapes.add_picture(hero_couple_img, Inches(8.7), Inches(1.5), Inches(3.6), Inches(4.8))

    slide1.notes_slide.notes_text_frame.text = (
        "Welcome to the complete architectural presentation of MAANMITRA. "
        "MAANMITRA is an integrated relationship and consensual live-in companion ecosystem engineered to unite "
        "deep compatibility matching with accredited mental-health guidance, daily lifestyle tools, and secure monetization."
    )

    # =========================================================================
    # SLIDE 2: PROJECT OVERVIEW & OBJECTIVES
    # =========================================================================
    slide2 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide2, CREAM)
    add_header(slide2, "1. Project Overview & Foundational Objectives", "EXECUTIVE SUMMARY")

    # 4 Pillar Cards
    pillars = [
        ("🤍 Verified Profiles", "Real People, Genuine Intentions", "Strict 18+ identity validation, zero tolerance for automated bots or commercial solicitation, and admin-moderated membership."),
        ("🛡️ Safe & Secure", "Zero Phone Disclosure", "Personal phone numbers are strictly encrypted in the database and omitted from all public serializers. Chat requires mutual consent."),
        ("👥 Smart Matching", "Live-in Compatibility", "Algorithmic scoring evaluating domestic routines, sleep schedules, financial expectations, and shared domestic values."),
        ("🌱 Live-in Support", "Holistic Couple Station", "Dedicated daily tools for cohabitation: wellness tracking, meal planning, medical document vaults, and certified counsellor bookings.")
    ]

    for idx, (head, sub, desc) in enumerate(pillars):
        left_pos = Inches(0.8 + idx * 2.95)
        create_card(slide2, left_pos, Inches(1.7), Inches(2.8), Inches(4.8), bg_color=WHITE, border_color=CARD_BORDER)
        
        # Header strip inside card
        strip = slide2.shapes.add_shape(MSO_SHAPE.RECTANGLE, left_pos, Inches(1.7), Inches(2.8), Inches(0.1))
        strip.fill.solid()
        strip.fill.fore_color.rgb = GOLD if idx % 2 == 1 else EMERALD_DARK
        strip.line.fill.background()

        tb = slide2.shapes.add_textbox(left_pos + Inches(0.2), Inches(2.0), Inches(2.4), Inches(4.3))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = head
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = EMERALD_DARK

        p_sub = tf.add_paragraph()
        p_sub.text = sub
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = GOLD
        p_sub.space_before = Pt(4)

        p_desc = tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.size = Pt(11)
        p_desc.font.color.rgb = CHARCOAL
        p_desc.space_before = Pt(12)

    slide2.notes_slide.notes_text_frame.text = (
        "MAANMITRA is anchored by four foundational pillars. Unlike superficial dating applications, "
        "every feature is designed to protect user psychological safety, ensure domestic compatibility, "
        "and foster transparent long-term co-living alignment."
    )

    # =========================================================================
    # SLIDE 3: PROBLEM STATEMENT & MARKET REALITY
    # =========================================================================
    slide3 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide3, CREAM)
    add_header(slide3, "2. Problem Statement: The Crisis in Modern Dating", "MARKET ANALYSIS")

    problems = [
        ("Endless Superficial Swiping", "Modern dating apps optimize for engagement and screen-time using superficial photos rather than lifestyle compatibility. This leads to user burnout, mismatch in living habits, and emotional fatigue."),
        ("Severe Privacy & Harassment Risks", "Sharing personal phone numbers and social handles early exposes individuals (especially women) to unwanted outreach, stalking, and harassment with zero platform boundaries."),
        ("The Stigma of Seeking Guidance", "Relationship difficulties are often addressed only after severe crisis occurs. Traditional counselling is seen as clinical, intimidating, and geographically inaccessible."),
        ("Fragmented Life & Cohabitation Tools", "Couples who move in together must juggle multiple disconnected apps for meal planning, chores, medical history sharing, travel itineraries, and budgeting.")
    ]

    for idx, (title, body) in enumerate(problems):
        row = idx // 2
        col = idx % 2
        l = Inches(0.8 + col * 5.95)
        t = Inches(1.8 + row * 2.5)
        
        card = create_card(slide3, l, t, Inches(5.7), Inches(2.2), bg_color=WHITE, border_color=ROSE)
        
        tb = slide3.shapes.add_textbox(l + Inches(0.25), t + Inches(0.2), Inches(5.2), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"🚨 {title}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = ROSE

        p2 = tf.add_paragraph()
        p2.text = body
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(6)

    slide3.notes_slide.notes_text_frame.text = (
        "These four critical market pain points define the opportunity for MAANMITRA. "
        "Urban professionals desire authentic domestic partnerships but are vulnerable to superficiality and privacy invasion."
    )

    # =========================================================================
    # SLIDE 4: THE PROPOSED SOLUTION & VALUE PROPOSITION
    # =========================================================================
    slide4 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide4, CREAM)
    add_header(slide4, "2b. The MAANMITRA Solution: Intentional Cohabitation", "PROPOSED SOLUTION")

    solutions = [
        ("Multi-Dimensional Compatibility Scoring", "Evaluates sleep schedules (early bird vs night owl), culinary styles, domestic tidiness, financial outlooks, and communication preferences to calculate a transparent match score."),
        ("Zero Phone Disclosure Architecture", "Phone numbers are stored purely for authentication/recovery and never exposed. In-app real-time chat and WebRTC calling operate seamlessly without sharing private contact info."),
        ("Embedded Clinical Triage & Guidance", "A 6-path decision tree links users directly to accredited practitioners or structured self-reflection workbooks for healthy conflict resolution and pre-marital readiness."),
        ("All-in-One Cohabitation Suite", "A unified Living Station featuring daily wellness check-ins, water/exercise trackers, calorie-conscious meal planning, encrypted health records, and shared travel budgeting.")
    ]

    for idx, (title, body) in enumerate(solutions):
        row = idx // 2
        col = idx % 2
        l = Inches(0.8 + col * 5.95)
        t = Inches(1.8 + row * 2.5)
        
        card = create_card(slide4, l, t, Inches(5.7), Inches(2.2), bg_color=WHITE, border_color=EMERALD_DARK)
        
        tb = slide4.shapes.add_textbox(l + Inches(0.25), t + Inches(0.2), Inches(5.2), Inches(1.8))
        tf = tb.text_frame
        tf.word_wrap = True
        
        p = tf.paragraphs[0]
        p.text = f"✨ {title}"
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.name = "Georgia"
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = body
        p2.font.size = Pt(11.5)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(6)

    slide4.notes_slide.notes_text_frame.text = (
        "The MAANMITRA solution directly addresses each market deficiency. "
        "By merging psychological guidance with everyday domestic tools, the platform acts as both a matchmaking engine and a living companion."
    )

    # =========================================================================
    # SLIDE 5: BUSINESS MODEL & TARGET DEMOGRAPHICS
    # =========================================================================
    slide5 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide5, CREAM)
    add_header(slide5, "3. Business Model & Target Demographics", "MONETIZATION STRATEGY")

    # Left Column: Target Audience
    create_card(slide5, Inches(0.8), Inches(1.7), Inches(5.7), Inches(4.9), bg_color=WHITE)
    tb_aud = slide5.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_aud = tb_aud.text_frame
    tf_aud.word_wrap = True
    
    p = tf_aud.paragraphs[0]
    p.text = "🎯 Target Demographics"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    audiences = [
        ("Urban Professionals (Ages 22–45)", "Educated, financially autonomous individuals seeking progressive companionship, transparent live-in relationships, or emotional attunement."),
        ("Co-habitating Couples", "Couples already living under one roof needing a shared station for meal planning, wellness tracking, and conflict de-escalation."),
        ("Individuals in Life Transitions", "People recovering from past heartbreak or navigating marriage readiness who benefit from guided self-reflection and professional counselling."),
        ("Licensed Mental Health Practitioners", "Therapists, relationship coaches, and clinical psychologists seeking a verified, compliant digital practice portal.")
    ]
    for aud_title, aud_desc in audiences:
        pa = tf_aud.add_paragraph()
        pa.text = f"• {aud_title}: {aud_desc}"
        pa.font.size = Pt(10.5)
        pa.font.color.rgb = CHARCOAL
        pa.space_before = Pt(8)

    # Right Column: Revenue Streams
    create_card(slide5, Inches(6.8), Inches(1.7), Inches(5.7), Inches(4.9), bg_color=WHITE)
    tb_rev = slide5.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_rev = tb_rev.text_frame
    tf_rev.word_wrap = True

    p = tf_rev.paragraphs[0]
    p.text = "💰 Hybrid Revenue Model"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    revs = [
        ("Tiered Monthly Subscriptions", "Predictable recurring revenue from MANMITRA Basic (₹499/mo) and Premium (₹999/mo) plans providing higher daily quotas, calling, and included sessions."),
        ("Clinical Appointment Facilitation", "Commission fee on professional appointments booked with verified counsellors through the integrated appointment engine."),
        ("Micro-Transactions / Add-on Packs", "Future pay-per-reflection packs, astrology compatibility reports, and extended video consultation minutes."),
        ("Curated Wellness Brand Partnerships", "Organic non-intrusive sponsorships for couple wellness getaways, organic groceries, and home co-living spaces.")
    ]
    for rev_title, rev_desc in revs:
        pr = tf_rev.add_paragraph()
        pr.text = f"• {rev_title}: {rev_desc}"
        pr.font.size = Pt(10.5)
        pr.font.color.rgb = CHARCOAL
        pr.space_before = Pt(8)

    slide5.notes_slide.notes_text_frame.text = (
        "The business model is ethical and high-margin. Rather than selling user data or showing intrusive programmatic ads, "
        "revenue comes directly from premium feature value, daily allowances, and clinical appointment bookings."
    )

    # =========================================================================
    # SLIDE 6: COMPLETE FEATURE & MODULE MATRIX
    # =========================================================================
    slide6 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide6, CREAM)
    add_header(slide6, "4. Feature & Module Architecture Matrix", "SYSTEM MODULES")

    modules = [
        ("Discover Engine", "Opposite-gender discovery, debounced keyword search, filter chips (For You, Nearby, Verified), and multi-factor compatibility percentage algorithm."),
        ("Connections Center", "Three-state connection lifecycle (Received, Sent, Connected) with Accept, Decline, and Cancel capabilities preventing unsolicited outreach."),
        ("Real-time Chat", "Bi-directional WebSocket messaging with typing awareness, offline fallback polling, message database persistence, and daily limit enforcement."),
        ("Counselling Hub", "Clinical triage decision tree, practitioner directory, slot booking, session confirmation, and interactive psychological self-reflection workbooks."),
        ("Lifestyle Station", "Personalized daily wellness station (mood, water, fitness), daily meal planner, encrypted medical documents vault, and shared travel budgeting."),
        ("Admin Console", "Practitioner credential review & licensing approvals, live subscription revenue tracking, daily quota tuning, and safety reports moderation.")
    ]

    for idx, (m_title, m_desc) in enumerate(modules):
        r = idx // 3
        c = idx % 3
        l = Inches(0.8 + c * 3.95)
        t = Inches(1.7 + r * 2.5)

        create_card(slide6, l, t, Inches(3.75), Inches(2.3), bg_color=WHITE, border_color=CARD_BORDER)
        
        tb = slide6.shapes.add_textbox(l + Inches(0.2), t + Inches(0.2), Inches(3.35), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = m_title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = m_desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(6)

    slide6.notes_slide.notes_text_frame.text = (
        "The application is structured into six core modular domains. "
        "Each module communicates cleanly via REST API endpoints or WebSocket channels, ensuring high cohesion and low coupling."
    )

    # =========================================================================
    # SLIDE 7: USER ROLES & ACCESS CONTROL HIERARCHY
    # =========================================================================
    slide7 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide7, CREAM)
    add_header(slide7, "5. User Roles, Tiers & Permissions Matrix", "SECURITY & RBAC")

    # Add Table
    rows = 7
    cols = 6
    left = Inches(0.8)
    top = Inches(1.7)
    width = Inches(11.733)
    height = Inches(5.0)

    table_shape = slide7.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table

    # Column widths
    table.columns[0].width = Inches(2.733)
    for c in range(1, 6):
        table.columns[c].width = Inches(1.8)

    headers = ["Platform Feature / Action", "Guest", "Free Member", "Basic Member", "Premium Member", "Platform Admin"]
    for c, h in enumerate(headers):
        cell = table.cell(0, c)
        cell.fill.solid()
        cell.fill.fore_color.rgb = EMERALD_DARK
        p = cell.text_frame.paragraphs[0]
        p.text = h
        p.font.bold = True
        p.font.size = Pt(11)
        p.font.color.rgb = WHITE
        p.alignment = PP_ALIGN.CENTER if c > 0 else PP_ALIGN.LEFT

    matrix_data = [
        ("Browse Public Web & Compatibility Clc", "✅ Yes", "✅ Yes", "✅ Yes", "✅ Yes", "✅ Yes"),
        ("Send Connection Requests to Members", "❌ No", "✅ Yes", "✅ Yes", "✅ Yes", "✅ Yes"),
        ("Real-Time Messaging Daily Allowance", "❌ None", "20 msgs / day", "20 msgs / day", "200 msgs / day", "Unlimited"),
        ("AI Relationship Guidance Queries", "❌ None", "5 queries / day", "5 queries / day", "50 queries / day", "Unlimited"),
        ("In-App WebRTC Voice & Video Calling", "❌ No", "❌ No", "❌ No", "✅ Yes", "✅ Yes"),
        ("Practitioner Verification & Admin Config", "❌ No", "❌ No", "❌ No", "❌ No", "✅ Full Superuser")
    ]

    for r, row_data in enumerate(matrix_data):
        for c, val in enumerate(row_data):
            cell = table.cell(r + 1, c)
            cell.fill.solid()
            cell.fill.fore_color.rgb = WHITE if r % 2 == 0 else GRAY_LIGHT
            p = cell.text_frame.paragraphs[0]
            p.text = val
            p.font.size = Pt(10.5)
            p.font.color.rgb = CHARCOAL
            p.alignment = PP_ALIGN.CENTER if c > 0 else PP_ALIGN.LEFT

    slide7.notes_slide.notes_text_frame.text = (
        "Role-Based Access Control (RBAC) is enforced at the FastAPI dependency layer. "
        "Endpoints check both user authentication status and the caller's subscription entitlement allowances before execution."
    )

    # =========================================================================
    # SLIDE 8: WEBSITE PAGES & NAVIGATION ARCHITECTURE
    # =========================================================================
    slide8 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide8, CREAM)
    add_header(slide8, "6. Website Pages & Navigation Architecture", "FRONTEND ARCHITECTURE")

    # Left: Public Website
    create_card(slide8, Inches(0.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE)
    tb_pub = slide8.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_pub = tb_pub.text_frame
    tf_pub.word_wrap = True

    p = tf_pub.paragraphs[0]
    p.text = "🌐 Public Official Website (OfficialWebsite.jsx)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    pub_pages = [
        ("Hero & Instant Filter", "Visitor search widget by gender, age, city & goal; couple hero visual."),
        ("Four Pillars Showcase", "In-depth breakdown of Verified Profiles, Privacy, Smart Match, Live-in Support."),
        ("Live-in Compatibility Calculator", "Interactive rhythm & atmosphere sliders generating real-time match indices."),
        ("Featured Verified Profiles", "Direct discovery preview carousel with verified member badges."),
        ("Relationship Wellbeing Strip", "Presentation of daily wellness, shared travel planning, and counselling."),
        ("FAQ Accordion & Trust Standards", "Transparent answers on verification, age criteria, and zero fee scams.")
    ]
    for p_title, p_desc in pub_pages:
        p_item = tf_pub.add_paragraph()
        p_item.text = f"• {p_title}: {p_desc}"
        p_item.font.size = Pt(10.5)
        p_item.font.color.rgb = CHARCOAL
        p_item.space_before = Pt(6)

    # Right: Member Portal
    create_card(slide8, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE)
    tb_port = slide8.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_port = tb_port.text_frame
    tf_port.word_wrap = True

    p = tf_port.paragraphs[0]
    p.text = "🔒 Authenticated Member Workspace (main.jsx)"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    port_pages = [
        ("Dashboard (Home)", "Welcome greeting, match recommendations, wellness summary, quick stats."),
        ("Discover & Connections", "Opposite-gender discovery, profile viewing, 3-stage connection pipeline."),
        ("Messages & Live Chat", "Real-time WebSocket chat room, typing status, voice/video trigger."),
        ("Counselling Hub & Triage", "Triage decision engine, practitioner directory, booking pop-up."),
        ("Lifestyle Hub", "Wellness tracking, meal plans, encrypted health records, travel planner."),
        ("Admin Console (Restricted)", "Practitioner verification, subscription metrics, system config editor.")
    ]
    for p_title, p_desc in port_pages:
        p_item = tf_port.add_paragraph()
        p_item.text = f"• {p_title}: {p_desc}"
        p_item.font.size = Pt(10.5)
        p_item.font.color.rgb = CHARCOAL
        p_item.space_before = Pt(6)

    slide8.notes_slide.notes_text_frame.text = (
        "The frontend operates as a unified single-page application (SPA). "
        "The root component dynamically toggles between the marketing-oriented Official Website and the "
        "authenticated Member Workspace based on the presence of a validated JWT token."
    )

    # =========================================================================
    # SLIDE 9: COMPLETE USER JOURNEY & WORKFLOW
    # =========================================================================
    slide9 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide9, CREAM)
    add_header(slide9, "7. End-to-End User Journey & Operational Workflow", "USER LIFECYCLE")

    steps = [
        ("Step 1: Discovery & Evaluation", "Visitor lands on official site, explores the four pillars, tests the Live-in Compatibility Calculator, and views verified member previews."),
        ("Step 2: 18+ Verified Onboarding", "User registers with age validation, agrees to terms, receives a secure JWT token, and enters the personalized Member Portal."),
        ("Step 3: Finding Alignment", "User browses candidate profiles with lifestyle compatibility scores and dispatches a mutual connection request."),
        ("Step 4: Consensual Connection", "Target member reviews request in their Connections tab and accepts. Real-time messaging and calling are immediately unlocked."),
        ("Step 5: Daily Co-living Station", "Couple engages daily via wellness check-ins, joint meal planning, encrypted medical records storage, and travel itineraries."),
        ("Step 6: Clinical Growth & Upgrade", "User accesses guided reflection workbooks or upgrades to Premium for unlimited calling and accredited therapist consultations.")
    ]

    for idx, (s_title, s_desc) in enumerate(steps):
        r = idx // 2
        c = idx % 2
        l = Inches(0.8 + c * 5.95)
        t = Inches(1.7 + r * 1.7)

        create_card(slide9, l, t, Inches(5.7), Inches(1.5), bg_color=WHITE, border_color=GOLD if idx % 2 == 1 else EMERALD_DARK)
        
        tb = slide9.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.3), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = s_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = s_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(4)

    slide9.notes_slide.notes_text_frame.text = (
        "The user lifecycle follows a logical progression from public discovery to verified connection, "
        "daily habit formation, and eventual clinical support. Every stage reinforces safety and mutual consent."
    )

    # =========================================================================
    # SLIDE 10: REGISTRATION & AUTHENTICATION FLOW
    # =========================================================================
    slide10 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide10, CREAM)
    add_header(slide10, "8. Secure Registration & Authentication Protocol", "IDENTITY & SECURITY")

    # 3 Flow Cards
    flow_cards = [
        ("1. Strict 18+ Validation", [
            "Client posts full name, email, password, gender, and date of birth.",
            "Backend computes exact age in years from date_of_birth.",
            "If user is under 18, request is immediately rejected with HTTP 400 Bad Request.",
            "Guarantees compliance with adult consent and matrimonial standards."
        ]),
        ("2. Password Cryptography", [
            "Raw password strings are never logged or stored in clear text.",
            "Uses passlib.context.CryptContext with bcrypt hashing algorithm.",
            "Salted hashes protect against rainbow tables and collision attacks.",
            "Verified at login via crypt_context.verify()."
        ]),
        ("3. JWT Bearer Tokens", [
            "Issues signed JSON Web Tokens using python-jose (HS256 algorithm).",
            "Payload contains subject ('sub'=user_id), role, and expiration timestamp.",
            "Token passed in Authorization: Bearer <token> for REST endpoints.",
            "Token passed as query parameter ?token=<jwt> for WebSocket handshakes."
        ])
    ]

    for idx, (f_title, f_items) in enumerate(flow_cards):
        l = Inches(0.8 + idx * 3.95)
        create_card(slide10, l, Inches(1.7), Inches(3.75), Inches(5.0), bg_color=WHITE, border_color=CARD_BORDER)

        tb = slide10.shapes.add_textbox(l + Inches(0.2), Inches(1.9), Inches(3.35), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f_title
        p.font.size = Pt(16)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        for item in f_items:
            pi = tf.add_paragraph()
            pi.text = f"• {item}"
            pi.font.size = Pt(11)
            pi.font.color.rgb = CHARCOAL
            pi.space_before = Pt(8)

    slide10.notes_slide.notes_text_frame.text = (
        "Authentication is fortified with industrial standards. "
        "Age enforcement happens server-side, eliminating client manipulation, while bcrypt and JWT secure data at rest and in transit."
    )

    # =========================================================================
    # SLIDE 11: COUNSELLING SERVICES & TRIAGE WORKFLOW
    # =========================================================================
    slide11 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide11, CREAM)
    add_header(slide11, "9. Relationship Counselling Services & Triage Decision Tree", "CLINICAL GUIDANCE")

    # Triage decision tree (Left)
    create_card(slide11, Inches(0.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE)
    tb_tri = slide11.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_tri = tb_tri.text_frame
    tf_tri.word_wrap = True

    p = tf_tri.paragraphs[0]
    p.text = "🧭 6-Path Clinical Triage Navigation"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    tri_items = [
        ("My Relationships", "Communication stumbling blocks, trust rebuilding, boundaries & mutual expectations."),
        ("Understanding Myself", "Personal attachment styles (anxious/avoidant/secure) & emotional self-clarity."),
        ("Emotional Support", "Safe, non-judgmental space to process grief, anxiety, and breakup recovery."),
        ("Marriage & Live-in Readiness", "Financial transparency, domestic chore distribution, and long-term values."),
        ("Personal Growth", "Self-confidence cultivation, life transitions, and career-relationship balance."),
        ("Something Else", "Multidisciplinary exploration across holistic relationship wellness.")
    ]
    for t_head, t_sub in tri_items:
        pt = tf_tri.add_paragraph()
        pt.text = f"• {t_head}: {t_sub}"
        pt.font.size = Pt(10)
        pt.font.color.rgb = CHARCOAL
        pt.space_before = Pt(6)

    # Categories & Reflections (Right)
    create_card(slide11, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE)
    tb_ref = slide11.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_ref = tb_ref.text_frame
    tf_ref.word_wrap = True

    p = tf_ref.paragraphs[0]
    p.text = "📖 Self-Reflection Workbooks & AI Guidance"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    ref_items = [
        ("Structured Perspective Prompts", "Evidence-based psychological perspectives explaining the underlying emotional need behind couple conflicts."),
        ("Deep Inquiry Questions", "Curated prompt sequences encouraging vulnerability rather than blame (e.g. 'How would you express your hope without dwelling on faults?')."),
        ("Actionable Grounding Exercises", "Practical exercises such as the '24-Hour Active Listening Pause' to practice non-defensive attunement."),
        ("Server-Enforced Daily Quotas", "Free/Basic users enjoy 5 guidance queries daily; Premium users access 50 queries daily with advanced reflection prompts.")
    ]
    for r_head, r_sub in ref_items:
        pr = tf_ref.add_paragraph()
        pr.text = f"• {r_head}: {r_sub}"
        pr.font.size = Pt(10.5)
        pr.font.color.rgb = CHARCOAL
        pr.space_before = Pt(8)

    slide11.notes_slide.notes_text_frame.text = (
        "Counselling is democratized through triage. Instead of forcing users into an intimidating clinical search, "
        "the triage decision tree guides them to the exact category, self-reflection workbook, or verified therapist they need."
    )

    # =========================================================================
    # SLIDE 12: SUBSCRIPTION PACKAGES & PRICING
    # =========================================================================
    slide12 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide12, CREAM)
    add_header(slide12, "10. Subscription Packages & Pricing Breakdown", "TIER COMPARISON")

    # 3 Plan Comparison Cards
    plan_cards = [
        ("Free Community Member", "₹0 / Free Forever", EMERALD_DARK, WHITE, [
            "Browse public discovery catalog",
            "Interactive Compatibility Calculator",
            "Send & receive connection requests",
            "20 real-time chat messages / day",
            "5 AI relationship guidance queries / day",
            "Access to free educational guides",
            "Full access to Lifestyle Station"
        ]),
        ("MANMITRA Basic", "₹499 / Month", GOLD, CHARCOAL, [
            "All Free Member capabilities",
            "20 messages / day limit (configurable)",
            "5 AI guidance reflections / day",
            "Full Educational Article Library access",
            "Golden Shield verification badge",
            "Priority helpdesk support tickets",
            "Standard cancellation grace period"
        ]),
        ("MANMITRA Premium", "₹999 / Month", EMERALD_DEEP, WHITE, [
            "All Basic Member capabilities",
            "200 messages / day high-bandwidth quota",
            "50 AI guidance reflections / day",
            "1 Included Certified Counselling Session",
            "In-App WebRTC Voice & Video Calling",
            "Emerald Crown VIP profile highlight",
            "Zero private phone number disclosure"
        ])
    ]

    for idx, (p_title, p_price, header_bg, header_fg, features) in enumerate(plan_cards):
        l = Inches(0.8 + idx * 3.95)
        create_card(slide12, l, Inches(1.7), Inches(3.75), Inches(5.0), bg_color=WHITE, border_color=CARD_BORDER)

        # Header Box
        h_shape = slide12.shapes.add_shape(MSO_SHAPE.RECTANGLE, l, Inches(1.7), Inches(3.75), Inches(1.1))
        h_shape.fill.solid()
        h_shape.fill.fore_color.rgb = header_bg
        h_shape.line.fill.background()

        tb_h = slide12.shapes.add_textbox(l + Inches(0.2), Inches(1.75), Inches(3.35), Inches(1.0))
        tf_h = tb_h.text_frame
        tf_h.word_wrap = True
        p = tf_h.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = header_fg

        p_pr = tf_h.add_paragraph()
        p_pr.text = p_price
        p_pr.font.size = Pt(13)
        p_pr.font.bold = True
        p_pr.font.color.rgb = GOLD_LIGHT if header_bg == EMERALD_DEEP or header_bg == EMERALD_DARK else EMERALD_DARK

        # Feature items
        tb_f = slide12.shapes.add_textbox(l + Inches(0.2), Inches(2.9), Inches(3.35), Inches(3.6))
        tf_f = tb_f.text_frame
        tf_f.word_wrap = True
        for f_idx, feat in enumerate(features):
            pf = tf_f.paragraphs[0] if f_idx == 0 else tf_f.add_paragraph()
            pf.text = f"✓ {feat}"
            pf.font.size = Pt(10.5)
            pf.font.color.rgb = CHARCOAL
            pf.space_before = Pt(4)

    slide12.notes_slide.notes_text_frame.text = (
        "Pricing is calibrated for high accessibility in the Indian and global urban market. "
        "At ₹499 and ₹999, the plans provide clear utility and tangible perks—particularly in-app calling and included therapy."
    )

    # =========================================================================
    # SLIDE 13: PRACTITIONER BOOKING WORKFLOW
    # =========================================================================
    slide13 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide13, CREAM)
    add_header(slide13, "11. Practitioner Booking & Appointment Lifecycle", "APPOINTMENTS ENGINE")

    # 4 Workflow Steps
    b_steps = [
        ("1. Practitioner Selection", [
            "Member browses verified practitioners filterable by category, rating, experience, and fee.",
            "Reviews bio, clinical licenses, and accepted consultation modes.",
            "Clicks 'Book Appointment' to launch modal."
        ]),
        ("2. Slot & Mode Allocation", [
            "Selects consultation date and available time slot (e.g. 10:00 AM - 11:00 AM).",
            "Chooses consultation mode: Video Call, Audio Call, or In-Person Clinic.",
            "Provides an optional private context note for the counsellor."
        ]),
        ("3. Booking Record Creation", [
            "POST /api/appointments creates appointment record in state 'requested'.",
            "Included session allowance checked for Premium members.",
            "Confirmation alert dispatched to user interface."
        ]),
        ("4. Practitioner Confirmation", [
            "Practitioner views booking in Counsellor Portal (/api/counsellor/me/appointments).",
            "Practitioner updates appointment to 'confirmed' or 'completed'.",
            "Member dashboard instantly reflects status change."
        ])
    ]

    for idx, (b_title, b_items) in enumerate(b_steps):
        r = idx // 2
        c = idx % 2
        l = Inches(0.8 + c * 5.95)
        t = Inches(1.7 + r * 2.5)

        create_card(slide13, l, t, Inches(5.7), Inches(2.2), bg_color=WHITE, border_color=EMERALD_DARK)

        tb = slide13.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.3), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = b_title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        for item in b_items:
            pi = tf.add_paragraph()
            pi.text = f"• {item}"
            pi.font.size = Pt(10.5)
            pi.font.color.rgb = CHARCOAL
            pi.space_before = Pt(3)

    slide13.notes_slide.notes_text_frame.text = (
        "The appointment engine coordinates both ends of the consultation. "
        "Practitioners retain complete sovereignty over their schedules, while clients enjoy transparent booking confirmations."
    )

    # =========================================================================
    # SLIDE 14: PAYMENT GATEWAY INTEGRATION (RAZORPAY)
    # =========================================================================
    slide14 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide14, CREAM)
    add_header(slide14, "12. Payment Gateway Integration: Razorpay Architecture", "PAYMENTS & BILLING")

    pay_steps = [
        ("1. Order Creation", "POST /api/subscriptions/checkout dispatches an order request to Razorpay for ₹499 or ₹999. A record is logged in payment_transactions with status 'created'."),
        ("2. Checkout Presentation", "CheckoutModal.jsx initializes the Razorpay modal. The user completes payment using UPI (GPay/PhonePe), NetBanking, Credit/Debit cards, or Wallets."),
        ("3. Signature Verification", "Client posts razorpay_order_id, razorpay_payment_id, and razorpay_signature to /api/subscriptions/verify. Backend computes HMAC-SHA256 signature to guarantee zero tampering."),
        ("4. Entitlement Activation", "Upon cryptographic verification, payment_transactions is updated to 'verified', and user_subscriptions is created/extended for 30 days. Entitlements update instantly."),
        ("5. Grace Period & Cancellation", "Users can cancel anytime via POST /api/subscriptions/cancel. The subscription status transitions to 'cancelled', but paid benefits remain active until the billing period ends."),
        ("6. Webhook Idempotency", "A secure webhook endpoint (/api/payments/webhook) processes background payment events with signature validation and idempotency safeguards.")
    ]

    for idx, (p_title, p_desc) in enumerate(pay_steps):
        r = idx // 2
        c = idx % 2
        l = Inches(0.8 + c * 5.95)
        t = Inches(1.7 + r * 1.7)

        create_card(slide14, l, t, Inches(5.7), Inches(1.5), bg_color=WHITE, border_color=GOLD if idx % 2 == 1 else EMERALD_DARK)

        tb = slide14.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.3), Inches(1.2))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = p_title
        p.font.size = Pt(13)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = p_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(3)

    slide14.notes_slide.notes_text_frame.text = (
        "Payment integration adheres strictly to Razorpay's security standards. "
        "Server-side HMAC-SHA256 verification prevents client spoofing, and cancellation logic protects consumer rights with full grace-period access."
    )

    # =========================================================================
    # SLIDE 15: REAL-TIME WEBSOCKET MESSAGING PROTOCOL
    # =========================================================================
    slide15 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide15, CREAM)
    add_header(slide15, "13. Real-Time WebSocket Messaging Protocol & Quota Engine", "WEBSOCKETS")

    # Left: Protocol Specs
    create_card(slide15, Inches(0.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE)
    tb_ws = slide15.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_ws = tb_ws.text_frame
    tf_ws.word_wrap = True

    p = tf_ws.paragraphs[0]
    p.text = "⚡ WebSocket Handshake & Security"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    ws_specs = [
        ("URI Specification", "ws://localhost:8000/api/ws/chat/{peer_id}?token={jwt_token}"),
        ("Handshake Verification", "Server decodes JWT and validates account status. Rejects with 4401 if invalid or inactive."),
        ("Mutual Consent Validation", "Server verifies sender and receiver have an accepted connection. Rejects with 4403 if blocked or not connected."),
        ("In-Memory Fanout Registry", "ChatConnectionManager tracks active connection instances by user_id for multi-device broadcast."),
        ("Database-First Persistence", "Every incoming message is persisted in SQLite/PostgreSQL before broadcasting to recipient."),
        ("Automatic HTTP Fallback", "If network drops socket, frontend seamlessly falls back to POST /api/messages/{id} with polling.")
    ]
    for w_head, w_desc in ws_specs:
        pw = tf_ws.add_paragraph()
        pw.text = f"• {w_head}: {w_desc}"
        pw.font.size = Pt(10)
        pw.font.color.rgb = CHARCOAL
        pw.space_before = Pt(5)

    # Right: Payload & Quota
    create_card(slide15, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE)
    tb_pay = slide15.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_pay = tb_pay.text_frame
    tf_pay.word_wrap = True

    p = tf_pay.paragraphs[0]
    p.text = "📊 Quota Enforcement & Event Schema"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    pay_items = [
        ("Client Dispatch Payload", "{\"type\": \"message\", \"body\": \"Hello! Let's discuss shared routines.\"}\n(Strictly validated 1–4000 characters)."),
        ("Server Broadcast Event", "{\"type\": \"message\", \"message\": {\"id\": 142, \"sender_id\": 12, \"receiver_id\": 15, \"body\": \"...\", \"created_at\": \"2026-10-30T17:00:00Z\"}}"),
        ("Server-Side Quota Gate", "SubscriptionEntitlementService checks daily_usage_tracking table. If daily limit exceeded (e.g. 20 msgs), socket sends limit_exceeded event."),
        ("Daily Reset Mechanism", "Usage counters automatically reset each day at midnight (UTC) based on calendar date tracking.")
    ]
    for p_head, p_desc in pay_items:
        pp = tf_pay.add_paragraph()
        pp.text = f"• {p_head}:\n  {p_desc}"
        pp.font.size = Pt(9.5)
        pp.font.color.rgb = CHARCOAL
        pp.space_before = Pt(6)

    slide15.notes_slide.notes_text_frame.text = (
        "WebSocket messaging is fortified with dual-layer safety: "
        "mutual connection checks prevent spam before messages are accepted, and database-first persistence guarantees zero message loss."
    )

    # =========================================================================
    # SLIDE 16: PRIVACY & DATA PROTECTION ARCHITECTURE
    # =========================================================================
    slide16 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide16, CREAM)
    add_header(slide16, "14. Privacy, Security & Data Protection Standards", "CONFIDENTIALITY")

    priv_cards = [
        ("Zero Phone Disclosure", "Personal phone numbers are strictly encrypted at rest and omitted from all public profile serializers. Chatting and calling occur entirely within secure app channels."),
        ("Mutual Consent Gating", "Strangers cannot initiate direct messages or video calls. Communication is locked until both parties mutually request and accept a connection."),
        ("Encrypted Document Vault", "User medical documents and lab reports are stored under randomized UUIDs in an isolated uploads directory, accessible only via owner-verified token endpoints."),
        ("Granular Visibility Controls", "Members can toggle Discoverability off at any time to browse quietly, hide their age from public profile cards, or conceal their online presence."),
        ("Right to Erasure (Hard Delete)", "Executing DELETE /api/me triggers a cascading hard delete wiping all connections, messages, health reports, check-ins, and usage logs."),
        ("Tamper-Proof Signatures", "Razorpay webhooks and payment verifications utilize HMAC-SHA256 signature validation with server-side secrets.")
    ]

    for idx, (p_title, p_desc) in enumerate(priv_cards):
        r = idx // 3
        c = idx % 3
        l = Inches(0.8 + c * 3.95)
        t = Inches(1.7 + r * 2.5)

        create_card(slide16, l, t, Inches(3.75), Inches(2.3), bg_color=WHITE, border_color=CARD_BORDER)

        tb = slide16.shapes.add_textbox(l + Inches(0.2), t + Inches(0.2), Inches(3.35), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"🛡️ {p_title}"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = p_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(6)

    slide16.notes_slide.notes_text_frame.text = (
        "Privacy is not an afterthought in MAANMITRA; it is the platform's primary design constraint. "
        "By enforcing zero phone disclosure and mutual consent, user security is structurally guaranteed."
    )

    # =========================================================================
    # SLIDE 17: ADMIN DASHBOARD & MANAGEMENT WORKFLOW
    # =========================================================================
    slide17 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide17, CREAM)
    add_header(slide17, "15. Administrative Dashboard & Management Workflow", "ADMINISTRATION")

    admin_cards = [
        ("Practitioner Verification Queue", "AdminCounsellorVerification.jsx lets administrators review submitted practitioner licenses, qualifications, and degree proofs. Status transitions: Application Submitted ➔ Under Review ➔ Approved ➔ Additional Info Required ➔ Not Approved."),
        ("Subscription & Revenue Analytics", "AdminSubscriptions.jsx tracks total verified revenue (INR), active subscriber breakdown (Basic vs Premium), expired subscriptions, and failed transaction audit trails with Razorpay order IDs."),
        ("Dynamic System Limit Controls", "Administrators can tune daily message limits (e.g. 20 ➔ 30), AI guidance caps, and included monthly counselling quotas dynamically without redeploying backend code."),
        ("User Moderation & Safety Reports", "Review queue for member abuse reports (/api/admin/reports). Staff can review filed complaints, update report status (open ➔ resolved), or deactivate malicious accounts with one click.")
    ]

    for idx, (a_title, a_desc) in enumerate(admin_cards):
        r = idx // 2
        c = idx % 2
        l = Inches(0.8 + c * 5.95)
        t = Inches(1.7 + r * 2.5)

        create_card(slide17, l, t, Inches(5.7), Inches(2.2), bg_color=WHITE, border_color=EMERALD_DARK)

        tb = slide17.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.3), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"⚙️ {a_title}"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = a_desc
        p2.font.size = Pt(10.5)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(4)

    slide17.notes_slide.notes_text_frame.text = (
        "The administrative suite provides total governance. "
        "From manual credential verification of therapists to real-time subscription revenue analytics, administrators have complete control."
    )

    # =========================================================================
    # SLIDE 18: FULL-STACK TECHNOLOGY STACK
    # =========================================================================
    slide18 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide18, CREAM)
    add_header(slide18, "16. Full-Stack Technology Stack & Tooling", "TECH STACK")

    # 4 Tech Category Cards
    tech_stacks = [
        ("Frontend Tier", "React 18 & Vite Bundler", [
            "React 18.3.1 with Fast Refresh",
            "Vite 6.1.0 ultra-fast module bundler",
            "Lucide React (0.468.0) SVG icon suite",
            "Vanilla CSS Design System with theme variables (Romantic, Emerald, Dark)",
            "Native WebSocket API + fallback polling"
        ]),
        ("Backend Tier", "FastAPI & Python 3.11", [
            "FastAPI 0.115+ asynchronous framework",
            "Uvicorn high-concurrency ASGI server",
            "Pydantic v2 data models & validation",
            "python-jose for JWT bearer tokens",
            "passlib[bcrypt] for salted password hashes"
        ]),
        ("Data & Persistence Tier", "SQLAlchemy 2.0 & DB", [
            "SQLAlchemy 2.0 ORM with mapped columns",
            "SQLite (living_relationships.db) local default",
            "PostgreSQL production compatibility",
            "Encrypted local storage vault (/uploads)",
            "Daily usage tracking counters table"
        ]),
        ("DevOps & Tooling", "Container & Automation", [
            "Docker & Docker Compose containerization",
            "PowerShell startup scripts (run_backend.ps1)",
            "Batch runner (start_app.bat)",
            "pytest test runner suite",
            "Razorpay REST API & Webhook SDK"
        ])
    ]

    for idx, (t_cat, t_sub, t_items) in enumerate(tech_stacks):
        l = Inches(0.8 + idx * 2.95)
        create_card(slide18, l, Inches(1.7), Inches(2.8), Inches(5.0), bg_color=WHITE, border_color=CARD_BORDER)

        tb = slide18.shapes.add_textbox(l + Inches(0.2), Inches(1.9), Inches(2.4), Inches(4.5))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = t_cat
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p_sub = tf.add_paragraph()
        p_sub.text = t_sub
        p_sub.font.size = Pt(11)
        p_sub.font.bold = True
        p_sub.font.color.rgb = GOLD
        p_sub.space_before = Pt(3)

        for item in t_items:
            pi = tf.add_paragraph()
            pi.text = f"• {item}"
            pi.font.size = Pt(9.5)
            pi.font.color.rgb = CHARCOAL
            pi.space_before = Pt(6)

    slide18.notes_slide.notes_text_frame.text = (
        "The technology stack is modern, lightweight, and exceptionally fast. "
        "FastAPI provides native asynchronous throughput, while React 18 ensures snappy UI transitions."
    )

    # =========================================================================
    # SLIDE 19: SYSTEM ARCHITECTURE DIAGRAM
    # =========================================================================
    slide19 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide19, CREAM)
    add_header(slide19, "17. Multi-Tier System Architecture Diagram", "ARCHITECTURE")

    # Big Architecture Card
    create_card(slide19, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.0), bg_color=WHITE)

    tb_arch = slide19.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(11.133), Inches(4.5))
    tf_arch = tb_arch.text_frame
    tf_arch.word_wrap = True

    p = tf_arch.paragraphs[0]
    p.text = "🏗️ End-to-End Architectural Data Flow"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    layers = [
        ("1. Presentation Layer (Client Tier)", "React 18 Single-Page Application running on Vite. Comprises the public website (OfficialWebsite.jsx), Member Workspace (main.jsx), Counselling Hub (CounsellingHub.jsx), and Admin Dashboards (AdminSubscriptions.jsx, AdminCounsellorVerification.jsx)."),
        ("2. Gateway & Transport Tier", "HTTP/HTTPS REST API traffic directed to port 8000; persistent bi-directional WebSocket connections routed to /api/ws/chat/{user_id} with JWT bearer authorization."),
        ("3. Application Logic Tier (FastAPI)", "Composed of modular Python services: AuthModule (OAuth2/JWT/Bcrypt), SubscriptionEntitlementService (entitlements.py), PaymentGatewayService (payment_service.py), and ChatConnectionManager (in-memory multi-client routing)."),
        ("4. Persistence & Storage Tier", "Relational database managed via SQLAlchemy 2.0 ORM (SQLite / PostgreSQL) housing 14 normalized tables. Static files and private medical records isolated in /uploads directory."),
        ("5. External Integration Tier", "Razorpay Payment Gateway API for checkout order generation, webhook signature validation, and subscription status synchronization.")
    ]

    for l_title, l_desc in layers:
        pl = tf_arch.add_paragraph()
        pl.text = f"• {l_title}: {l_desc}"
        pl.font.size = Pt(10.5)
        pl.font.color.rgb = CHARCOAL
        pl.space_before = Pt(8)

    slide19.notes_slide.notes_text_frame.text = (
        "The architecture adheres strictly to separation of concerns. "
        "The frontend manages user presentation, FastAPI handles business logic and entitlement validation, and the database provides relational integrity."
    )

    # =========================================================================
    # SLIDE 20: DATABASE DESIGN & ER DIAGRAM
    # =========================================================================
    slide20 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide20, CREAM)
    add_header(slide20, "18. Database Design & Entity Relationship Architecture", "DATABASE SCHEMA")

    # Table breakdown
    create_card(slide20, Inches(0.8), Inches(1.7), Inches(11.733), Inches(5.0), bg_color=WHITE)

    tb_db = slide20.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(11.133), Inches(4.5))
    tf_db = tb_db.text_frame
    tf_db.word_wrap = True

    p = tf_db.paragraphs[0]
    p.text = "🗄️ Core Relational Entities & Foreign Key Relationships"
    p.font.size = Pt(18)
    p.font.bold = True
    p.font.color.rgb = EMERALD_DARK

    db_entities = [
        ("users (Core Entity)", "id (PK), email (UQ), password_hash, full_name, username (UQ), phone (encrypted), gender, date_of_birth, location, bio, interests (JSON), relationship_goal, role (user/admin), discoverable, is_active."),
        ("connections (1:N with users)", "id (PK), requester_id (FK -> users.id), receiver_id (FK -> users.id), status (pending/accepted/declined/cancelled), created_at."),
        ("messages (1:N with users)", "id (PK), sender_id (FK -> users.id), receiver_id (FK -> users.id), body (Text 1-4000), created_at."),
        ("user_subscriptions & payment_transactions", "user_subscriptions: id (PK), user_id (FK), plan_id (FK), status (active/cancelled/expired), current_period_end.\npayment_transactions: id (PK), user_id (FK), provider_order_id, provider_payment_id, amount, status (verified/failed)."),
        ("counsellors & appointments", "counsellors: id (PK), name, email, specialization, experience_years, fee_inr, verification_status (Approved/Under Review), verified (Bool).\nappointments: id (PK), user_id (FK), counsellor_id (FK), appointment_date, time_slot, mode (video/audio/clinic), status."),
        ("lifestyle & auxiliary tables", "wellness_checkins, meals, health_reports, travel_plans, posts, post_likes, comments, support_tickets, reports, system_configs, daily_usage_tracking.")
    ]

    for e_title, e_desc in db_entities:
        pe = tf_db.add_paragraph()
        pe.text = f"• {e_title}:\n  {e_desc}"
        pe.font.size = Pt(9.5)
        pe.font.color.rgb = CHARCOAL
        pe.space_before = Pt(5)

    slide20.notes_slide.notes_text_frame.text = (
        "The relational schema is fully normalized. "
        "Foreign key cascading ensures data integrity, while indexed columns guarantee sub-millisecond lookups on frequent discovery queries."
    )

    # =========================================================================
    # SLIDE 21: TESTING, LOCAL EXECUTION & DEPLOYMENT
    # =========================================================================
    slide21 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide21, CREAM)
    add_header(slide21, "19. Testing, Local Execution & Deployment Guide", "DEVOPS & RUNTIME")

    deploy_cards = [
        ("1. Backend Startup", "PowerShell Script:\npowershell -ExecutionPolicy Bypass -File .\\run_backend.ps1\n• Launches Uvicorn ASGI server on port 8000 with auto-reload.\n• Swagger docs available at http://localhost:8000/docs."),
        ("2. Frontend Startup", "PowerShell Script:\npowershell -ExecutionPolicy Bypass -File .\\run_frontend.ps1\n• Runs Vite development server on port 5173 with Fast Refresh.\n• Proxies API and WebSocket requests to backend."),
        ("3. Production Docker", "Docker Compose:\ndocker compose up --build\n• Multi-stage build running backend with Uvicorn.\n• Frontend served via high-performance Nginx web server.\n• Persistent volumes for database and /uploads vault."),
        ("4. Automated Testing", "Pytest Suite:\npytest backend/tests/\n• Validates auth registration (18+ enforcement), connection state machine, messaging quotas, and payment signature verifications.")
    ]

    for idx, (d_title, d_desc) in enumerate(deploy_cards):
        r = idx // 2
        c = idx % 2
        l = Inches(0.8 + c * 5.95)
        t = Inches(1.7 + r * 2.5)

        create_card(slide21, l, t, Inches(5.7), Inches(2.2), bg_color=WHITE, border_color=EMERALD_DARK)

        tb = slide21.shapes.add_textbox(l + Inches(0.2), t + Inches(0.15), Inches(5.3), Inches(1.9))
        tf = tb.text_frame
        tf.word_wrap = True

        p = tf.paragraphs[0]
        p.text = f"🚀 {d_title}"
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = EMERALD_DARK

        p2 = tf.add_paragraph()
        p2.text = d_desc
        p2.font.size = Pt(10)
        p2.font.color.rgb = CHARCOAL
        p2.space_before = Pt(4)

    slide21.notes_slide.notes_text_frame.text = (
        "Deployment is streamlined for both local developers and production servers. "
        "PowerShell scripts allow immediate one-click execution on Windows, while Docker Compose guarantees cloud parity."
    )

    # =========================================================================
    # SLIDE 22: IMPLEMENTATION STATUS & GAP ANALYSIS
    # =========================================================================
    slide22 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide22, CREAM)
    add_header(slide22, "20. Implementation Status & Feature Gap Analysis", "STATUS AUDIT")

    # Left: Implemented
    create_card(slide22, Inches(0.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE, border_color=GREEN_SUCCESS)
    tb_imp = slide22.shapes.add_textbox(Inches(1.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_imp = tb_imp.text_frame
    tf_imp.word_wrap = True

    p = tf_imp.paragraphs[0]
    p.text = "✅ Verified Implemented Features (Operational)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = GREEN_SUCCESS

    imp_items = [
        "Public Website with interactive Live-in Compatibility Calculator",
        "18+ age validation & JWT authentication engine",
        "Opposite-gender discovery with compatibility matching algorithm",
        "3-stage connection pipeline (Request, Accept, Decline, Cancel)",
        "Real-time WebSocket chat with quota gating & fallback polling",
        "Counselling Hub triage decision tree & practitioner directory",
        "Appointment booking modal & practitioner review portal",
        "Admin practitioner credential review & status transitions",
        "Razorpay checkout, HMAC-SHA256 signature verification & plan upgrade",
        "Admin revenue analytics & dynamic quota limit tuning",
        "Lifestyle Station: Wellness log, diet planner, health vault, travel planner"
    ]
    for item in imp_items:
        pi = tf_imp.add_paragraph()
        pi.text = f"• {item}"
        pi.font.size = Pt(9.5)
        pi.font.color.rgb = CHARCOAL
        pi.space_before = Pt(3)

    # Right: Gaps / Planned
    create_card(slide22, Inches(6.8), Inches(1.7), Inches(5.7), Inches(5.0), bg_color=WHITE, border_color=ROSE)
    tb_gap = slide22.shapes.add_textbox(Inches(7.1), Inches(1.9), Inches(5.1), Inches(4.5))
    tf_gap = tb_gap.text_frame
    tf_gap.word_wrap = True

    p = tf_gap.paragraphs[0]
    p.text = "🚧 Incomplete / Mocked Features (In Progress)"
    p.font.size = Pt(15)
    p.font.bold = True
    p.font.color.rgb = ROSE

    gap_items = [
        ("External WebRTC TURN Relay Mesh", "Calling endpoints generate authenticated session room IDs, but audio/video transmission currently relies on browser P2P without dedicated TURN relay fallback for strict firewalls."),
        ("SMS / WhatsApp Live Gateways", "Appointment confirmations and alerts render in-app rather than via external SMS gateways (e.g. Twilio / Gupshup)."),
        ("Native Mobile App Builds", "The web app is 100% responsive across mobile viewports, but native Android (APK) and iOS (IPA) wrapper builds are not yet compiled."),
        ("Automated Clinical Background Checks", "Practitioner degree verification is currently manual via the Admin Dashboard rather than integrated with government medical council APIs.")
    ]
    for g_title, g_desc in gap_items:
        pg = tf_gap.add_paragraph()
        pg.text = f"• {g_title}: {g_desc}"
        pg.font.size = Pt(10)
        pg.font.color.rgb = CHARCOAL
        pg.space_before = Pt(6)

    slide22.notes_slide.notes_text_frame.text = (
        "This slide presents an honest engineering status audit. "
        "Core application logic, database models, WebSocket streaming, payments, and admin dashboards are fully operational, "
        "while external telecommunication relays and native mobile wrappers remain on the active roadmap."
    )

    # =========================================================================
    # SLIDE 23: FUTURE ENHANCEMENTS & CONCLUSION
    # =========================================================================
    slide23 = prs.slides.add_slide(blank_layout)
    set_slide_background(slide23, EMERALD_DEEP)

    # Header
    cat_box = slide23.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.35))
    cat_p = cat_box.text_frame.paragraphs[0]
    cat_p.text = "FUTURE ROADMAP & CONCLUSION".upper()
    cat_p.font.size = Pt(11)
    cat_p.font.bold = True
    cat_p.font.color.rgb = GOLD

    t_box = slide23.shapes.add_textbox(Inches(0.8), Inches(0.9), Inches(11.7), Inches(0.65))
    t_p = t_box.text_frame.paragraphs[0]
    t_p.text = "21. Strategic Roadmap & Project Conclusion"
    t_p.font.size = Pt(24)
    t_p.font.bold = True
    t_p.font.name = "Georgia"
    t_p.font.color.rgb = WHITE

    # Left: Roadmap Card
    create_card(slide23, Inches(0.8), Inches(1.8), Inches(5.7), Inches(5.0), bg_color=EMERALD_DARK, border_color=GOLD)
    tb_fut = slide23.shapes.add_textbox(Inches(1.1), Inches(2.0), Inches(5.1), Inches(4.5))
    tf_fut = tb_fut.text_frame
    tf_fut.word_wrap = True

    p = tf_fut.paragraphs[0]
    p.text = "🚀 Future Strategic Roadmap"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = GOLD

    fut_items = [
        ("AI Cohabitation Conflict Mediator", "Real-time non-violent communication prompts suggested during couple chat to de-escalate tension."),
        ("Joint Domestic Expense Splitter", "Direct UPI-linked cohabitation expense splitting for rent, domestic groceries, and utility bills."),
        ("Dedicated TURN/STUN Media Server", "Global low-latency media mesh guaranteeing 100% video calling connection rates on restricted cellular networks."),
        ("Regional Indian Language Localization", "Full interface translation into Hindi, Marathi, Bengali, Tamil, and Telugu for tier-2 urban adoption.")
    ]
    for f_head, f_desc in fut_items:
        pf = tf_fut.add_paragraph()
        pf.text = f"• {f_head}:\n  {f_desc}"
        pf.font.size = Pt(10)
        pf.font.color.rgb = WHITE
        pf.space_before = Pt(6)

    # Right: Conclusion Card
    create_card(slide23, Inches(6.8), Inches(1.8), Inches(5.7), Inches(5.0), bg_color=EMERALD_DARK, border_color=GOLD)
    tb_con = slide23.shapes.add_textbox(Inches(7.1), Inches(2.0), Inches(5.1), Inches(4.5))
    tf_con = tb_con.text_frame
    tf_con.word_wrap = True

    p = tf_con.paragraphs[0]
    p.text = "🌟 Project Conclusion"
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = GOLD

    p_con_desc = tf_con.add_paragraph()
    p_con_desc.text = (
        "MAANMITRA redefines modern digital companionship by bridging the gap between intentional "
        "co-habitation matchmaking, uncompromising privacy standards, and clinical relationship wellness.\n\n"
        "By grounding connections in lifestyle compatibility, eliminating superficial contact leaks, and providing couples "
        "with everyday domestic tools alongside certified therapists, MAANMITRA creates an authentic haven for people to:\n\n"
        "\"CONNECT HEARTS, LIVE TOGETHER.\""
    )
    p_con_desc.font.size = Pt(12)
    p_con_desc.font.color.rgb = RGBColor(230, 240, 235)
    p_con_desc.space_before = Pt(8)

    slide23.notes_slide.notes_text_frame.text = (
        "Thank you for reviewing the MAANMITRA platform presentation. "
        "The project stands as a complete, robust, full-stack application built for real-world reliability, "
        "psychological safety, and sustainable monetization."
    )

    # Save presentation
    output_path = os.path.join(os.path.dirname(__file__), "MAANMITRA_Project_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    build_presentation()
