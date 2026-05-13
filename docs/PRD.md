Claude Prompt / Product Spec
============================

Build a **high-fidelity clickable prototype** for an internal B2B web app called **Support Conversation Library** for a hypothetical company, **Acme**.

Use **React + Chakra UI**.

The prototype should feel realistic enough for **designer-led usability testing**.

1) Product context
------------------

Acme is a large B2B software company with:

*   ~150 support agents
    
*   ~20,000 support calls per month
    
*   ~100,000+ transcripts in the system
    

Each support agent handles roughly:

*   **33 calls per week**
    
*   about **6–7 calls per day**
    

Acme has:

*   transcripts with **timestamps** and **speaker labels**
    
*   call metadata:
    
    *   date/time
        
    *   agent name
        
    *   customer/account name
        
    *   region
        
    *   call duration
        
    *   optional tags (not consistently applied)
        
*   existing ticketing tools
    

Acme does **not** have a good way to:

*   search across conversations
    
*   identify patterns across calls
    
*   find evidence quickly
    
*   learn from transcripts without manually reading them
    

The current problem:

valuable knowledge is buried in transcripts, so teams rely on anecdotes instead of evidence.

2) Product goal
---------------

Design the **Support Conversation Library**, an internal tool that helps support teams and QA reviewers:

*   quickly find relevant conversations
    
*   understand what is happening across customer interactions
    
*   gather evidence from real calls
    
*   avoid manually reading long transcripts unless necessary
    

This is a **retrieval + synthesis + evidence** product.

It is **not** a transcript archive and **not** a generic analytics dashboard.

3) Primary users
----------------

Design for these two users:

### User 1: QA Manager

Responsible for:

*   monitoring call quality
    
*   checking policy compliance
    
*   identifying coaching opportunities
    
*   spotting recurring issues across agents or teams
    

Likely needs:

*   filter by agent / team / region / timeframe
    
*   inspect exact call moments quickly
    
*   review calls with escalations or quality concerns
    
*   compare patterns across agents
    
*   find representative examples for coaching
    

### User 2: Insights Lead

Responsible for:

*   surfacing trends
    
*   identifying top reasons for contact
    
*   spotting churn drivers
    
*   sharing findings with product and leadership
    
*   collecting evidence and quotes from real calls
    

Likely needs:

*   broad search across many calls
    
*   theme / trend discovery
    
*   quick summaries
    
*   evidence-backed insights
    
*   ability to save/share examples
    

4) Constraints and assumptions
------------------------------

Use these assumptions explicitly in the product design:

*   There are **100,000+ transcripts**, so navigation must support scale.
    
*   Tags exist but are **not consistently applied**, so the tool should not rely only on manual tagging.
    
*   Users should be able to discover information via:
    
    *   keyword search
        
    *   semantic/topic-oriented search
        
    *   metadata filters
        
    *   recurring themes
        
*   AI-assisted summarization, clustering, and snippet extraction are allowed.
    
*   Users need to trust the output, so every summary/insight should be tied back to transcript evidence.
    
*   This is an **internal tool**, so optimize for:
    
    *   speed
        
    *   density
        
    *   practicality
        
    *   clarity
        
    *   traceability
        

Do **not** overdesign for polish at the expense of workflow utility.

5) Core product thesis
----------------------

The product should support two main modes:

### A. Scan / discovery mode

Used when the user wants to:

*   find likely relevant calls quickly
    
*   browse recurring themes
    
*   spot trends or problem areas
    
*   avoid opening many transcripts
    

### B. Investigation / verification mode

Used when the user wants to:

*   inspect exact quotes or moments
    
*   verify what happened in a call
    
*   gather evidence for coaching or reporting
    
*   jump into transcript context
    

The UX should support this flow:

**Search / browse → narrow → preview relevance → inspect evidence → open transcript context → save/share**

6) What to design
-----------------

Build the MVP for the **Support Conversation Library**.

Include these pages:

### Page 1: Home / Search

Purpose:

Give users a fast starting point into the library.

Include:

*   page title: **Support Conversation Library**
    
*   global search bar with placeholder like:
    
    *   “Search calls, issues, quotes, accounts, or themes”
        
*   recent searches
    
*   suggested searches
    
*   saved views / shortcuts
    
*   lightweight trending themes section
    

Suggested saved views:

*   Escalations this week
    
*   Churn-risk calls
    
*   Billing complaints
    
*   Policy compliance review
    
*   Onboarding friction
    

Suggested theme examples:

*   SSO login issues
    
*   Missing analytics export
    
*   Billing confusion
    
*   Slow response frustration
    
*   Onboarding setup confusion
    

The home page should feel useful even before a query is entered.

### Page 2: Search Results

Purpose:

Help users narrow a large corpus of calls into a relevant set.

Layout:

*   top search bar
    
*   left filter panel
    
*   central results list
    
*   optional right summary/insights panel
    

#### Filters

Include:

*   date range
    
*   agent
    
*   team
    
*   region
    
*   account/customer
    
*   call duration
    
*   issue category
    
*   severity / escalation risk
    
*   outcome / sentiment
    
*   “Only flagged calls” toggle
    

Since tags are inconsistent, filters should feel partly metadata-driven and partly AI-assisted.

#### Results list

Need at least **12 realistic mock results**.

Each result card should include:

*   call title or short descriptor
    
*   customer/account name
    
*   date/time
    
*   agent name
    
*   region
    
*   call duration
    
*   severity or attention badge
    
*   issue/topic tags
    
*   2–3 line AI-generated call summary
    
*   a **Why this result** explanation
    
*   1–2 transcript snippets with bolded matching terms
    
*   flags where relevant:
    
    *   Escalation
        
    *   Churn risk
        
    *   Product bug
        
    *   Policy concern
        
    *   Coaching opportunity
        

Actions on each result:

*   Open call
    
*   Save to collection / view
    
*   Copy evidence
    

#### Right-side panel

Optional contextual panel showing:

*   result count
    
*   top recurring topics in current result set
    
*   most frequent agents / regions / issue categories
    
*   quick summary of what is surfacing in results
    

This panel should be useful but not overpower the core search experience.

### Page 3: Call Detail View

Purpose:

Let users inspect a single call without reading the entire transcript manually.

Include:

*   header with:
    
    *   call title
        
    *   account/customer
        
    *   date/time
        
    *   agent
        
    *   region
        
    *   duration
        
*   AI summary card
    
*   key moments panel
    
*   transcript viewer
    
*   metadata panel
    
*   evidence actions
    

#### AI summary card

Include:

*   short summary of the call
    
*   main issue
    
*   resolution outcome
    
*   notable risks / flags
    
*   label this clearly as AI-generated
    

#### Key moments

Show 4–6 key moments, such as:

*   customer reports bug
    
*   pricing confusion
    
*   asks to cancel
    
*   mentions competitor
    
*   agent misses policy step
    
*   escalation request
    

Each key moment should include:

*   timestamp
    
*   concise label
    
*   short evidence snippet
    
*   interaction to jump to transcript location
    

#### Transcript viewer

Show:

*   speaker labels
    
*   timestamps
    
*   readable transcript blocks
    
*   highlighted relevant lines
    
*   state changes when a key moment is clicked
    

Do **not** create a full transcript wall with no hierarchy.

The transcript should feel inspectable, not overwhelming.

#### Metadata panel

Include:

*   issue category
    
*   product area
    
*   escalation status
    
*   churn risk
    
*   sentiment
    
*   QA review status
    
*   optional tags
    
*   linked ticket ID placeholder
    

Actions:

*   Copy quote
    
*   Save evidence
    
*   Add to collection
    
*   Share summary
    

### Page 4: Themes / Insights

Purpose:

Help Insights Leads discover patterns across many calls.

This page should feel like a bridge between search and insight synthesis.

Include a list/grid of recurring themes.

Each theme should show:

*   theme name
    
*   number of related calls
    
*   trend direction
    
*   short summary
    
*   top related tags
    
*   representative evidence snippet
    
*   involved regions / teams if useful
    

Example themes:

*   Onboarding friction
    
*   Billing confusion
    
*   SSO login failures
    
*   Analytics export requests
    
*   Frustration with response times
    
*   Cancellation / churn intent
    

Clicking a theme should open a drawer, panel, or detail state showing:

*   summary of the theme
    
*   why it matters
    
*   example calls
    
*   common customer language
    
*   related product area
    
*   representative quotes
    
*   save/export actions
    

This page should not turn into a BI dashboard.

Keep it focused on discoverability and evidence.

### Optional Page 5: Saved Views / Collections

If time permits, include:

*   saved searches
    
*   evidence collections
    
*   named collections such as:
    
    *   Q2 churn evidence
        
    *   Escalation examples
        
    *   Coaching review set
        

7) UX principles
----------------

Reflect these principles clearly in the design:

### 1\. Fast to scan

Users should understand relevance before opening a call.

### 2\. Evidence-backed

Summaries, themes, and flags should always connect to transcript snippets or exact call moments.

### 3\. Built for scale

The design should feel credible for **100,000+ transcripts**.

### 4\. Supports both user types

QA Managers and Insights Leads should both feel this is for them, even if their flows differ.

### 5\. Internal-tool realism

Dense, practical, and efficient. Avoid glossy marketing aesthetics.

8) Important product decisions to reflect
-----------------------------------------

The prototype should make these decisions visible:

*   The product is **search-first**
    
*   It supports both:
    
    *   **known-item retrieval** (“find calls about billing confusion”)
        
    *   **pattern discovery** (“what issues are recurring this week?”)
        
*   Users should not need to read full transcripts unless necessary
    
*   AI is used to reduce effort, but outputs should remain inspectable
    
*   Metadata and AI work together because tags alone are unreliable
    
*   The MVP prioritizes:
    
    *   search
        
    *   filtering
        
    *   result previews
        
    *   evidence snippets
        
    *   call inspection
        
    *   themes
        

Do **not** add:

*   admin settings
    
*   role management
    
*   deep workflow automation
    
*   overly complex dashboards
    
*   excessive analytics widgets
    

9) Technical requirements
-------------------------

Use:

*   **React**
    
*   **Chakra UI**
    
*   **TypeScript preferred**
    
*   client-side mock data only
    
*   no backend required
    

Use Chakra UI components where appropriate:

*   Box
    
*   Flex
    
*   Grid
    
*   Stack
    
*   HStack
    
*   VStack
    
*   Input
    
*   Select
    
*   Checkbox
    
*   Switch
    
*   Badge
    
*   Tag
    
*   Button
    
*   IconButton
    
*   Tabs
    
*   Drawer
    
*   Accordion
    
*   Card
    
*   Skeleton
    

Keep component structure modular and reusable.

10) Visual design direction
---------------------------

Visual style should feel like:

*   modern internal B2B software
    
*   clean and structured
    
*   light mode
    
*   subtle borders
    
*   gray neutrals
    
*   blue accent
    
*   semantic colors for flags/badges
    
*   compact but readable layouts
    

Design for:

*   information density
    
*   hierarchy
    
*   utility
    
*   trust
    

Avoid:

*   oversized spacing
    
*   overly consumer-grade visuals
    
*   decorative empty states
    
*   heavy illustrations
    

11) Mock data requirements
--------------------------

Create realistic mock data for:

*   calls
    
*   agents
    
*   customers/accounts
    
*   regions
    
*   themes
    
*   issue categories
    
*   flags
    
*   transcript snippets
    
*   key moments
    

Product context can include issues like:

*   onboarding setup confusion
    
*   billing disputes
    
*   SSO login failures
    
*   reporting/analytics export requests
    
*   integration setup issues
    
*   permission/access confusion
    
*   churn/cancellation intent
    

Mock data should reflect a plausible support organization at Acme.

12) Required interactions
-------------------------

Prototype should support:

*   search from home to results
    
*   clicking saved views opens pre-filtered result states
    
*   changing filters updates visible result state
    
*   opening a result opens call detail
    
*   clicking a key moment focuses transcript region
    
*   clicking a theme opens theme detail
    
*   copying evidence shows lightweight feedback
    
*   loading and empty states for realism
    

Include at least:

*   no results state
    
*   no theme selected state
    
*   loading/skeleton state
    

13) Deliverables
----------------

Return:

1.  project structure
    
2.  component list
    
3.  mock data schema
    
4.  full code for prototype
    
5.  setup instructions
    

The output should be:

*   componentized
    
*   realistic
    
*   ready for usability testing
    
*   polished enough for presentation
    

14) Product nuance to handle in the prototype
---------------------------------------------

Please account for these realities in the UX:

*   Tags are inconsistent, so search and AI summaries should do real work.
    
*   QA Managers may want to inspect calls by **agent/team**.
    
*   Insights Leads may want to inspect by **theme/pattern**.
    
*   Users may need exact **quotes** to support coaching or leadership updates.
    
*   With 100,000+ transcripts, the product must help users **narrow confidently**.
    

15) Output expectations
-----------------------

When generating the prototype:

*   prioritize realism over novelty
    
*   make the UI feel like something that could actually ship
    
*   annotate assumptions lightly in code comments if useful
    
*   prefer fewer, well-developed flows over too many unfinished features
    

Short build-oriented version
============================

Build a high-fidelity React + Chakra UI prototype for an internal tool called **Support Conversation Library** for Acme, a B2B company with 150 support agents, 20,000 calls/month, and 100,000+ transcripts.

Design for:

*   QA Manager
    
*   Insights Lead
    

Pages:

*   Home/Search
    
*   Search Results
    
*   Call Detail
    
*   Themes/Insights
    
*   optional Saved Views
    

Core workflow:

Search / browse → narrow → preview relevance → inspect evidence → open transcript context.

Must reflect:

*   search-first experience
    
*   AI summaries + evidence snippets
    
*   metadata filters
    
*   scale to 100k+ transcripts
    
*   inconsistent tags
    
*   both pattern discovery and known-call retrieval
    
*   internal-tool density and realism
    

Use Chakra UI only. No backend. Use realistic mock data.