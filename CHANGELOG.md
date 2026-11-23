# Service Orders Change Log

One line per change people would notice, newest first. Add a line with every new version (the
version name in brackets once versions began). Before October 2026 many changes were uploaded
without descriptions; the portal has been in use since early October 2026.

## 2026-11-23

- Agreements: filing an executed MSA letter asks for the date it was executed (the last signature in DocuSign), today until changed and never in the future, instead of recording the day it was filed. Replace the Filed Copy shows and can correct it [20261123a]

## 2026-11-22

- Sign-in: Contractor HQ now uses the shared MISMO sign-in, like every other MISMO tool. One sign-in covers them all (no second sign-in from the Other MISMO Tools links or from another tool), the name chip is at the top right with its menu, and the sign-in screen, Forgot your password? and the emailed sign-in code are the shared ones. The sign-in stays in the browser for up to eight hours or until they sign out, instead of ending when the tab closes. A reset started here still comes back here [20261122j]
- Left nav: the Status Board is at the top, above every group, instead of at the bottom under Everything Else [20261122i]
- Sign-in: Change Password taken out of the left nav; Forgot your password? on the sign-in card is how anyone sets a new one. The sign-in code and remembered browsers stay [20261122h]
- Sign-in: two-step sign-in and Change Password, as the other MISMO tools have them. When the sign-in service emails a six-digit code, Contractor HQ asks for it (Send a New Code, Back to Sign In), and the browser is then remembered for 30 days, shared with the other MISMO tools. Change Password is in the left nav above Help, with the same live checks (13 characters, not your name, email or MISMO, both match) [20261122g]
- Sign-in: Forgot your password? emails a link to set a new one (one use, one hour), the same reset the other MISMO tools use. A locked account and a wrong password both offer it, and after setting the new password the person comes straight back to Contractor HQ, signed in [20261122f]
- Health colours: a true yellow, clearly apart from the red, in the Health buttons and every health dot, and at full strength on a submitted week [20261122e]
- My Hours: This Week and Upcoming are word-processor boxes with bold, italic, underline, bullet points, numbering and links (toolbar, or Ctrl+B / I / U / K). They are kept as plain text with light marks, so earlier notes read exactly as before, and they show formatted wherever MISMO reads them. The order's figures sit in one strip with the bar under them [20261122d]
- More room between Take It Back to Correct and the Normally Mine buttons; Help sits at the foot of the left nav, just above Sign Out [20261122d]
- Other MISMO Tools in the left nav also takes people who log time to Huddle, MISMO's meeting polls [20261122d]
- People who log time (facilitators and architects) have Other MISMO Tools in the left nav: Initiative Hub, MMS and Meeting Trackers, each opening in a new tab. A company's signer and MISMO staff who log no time do not see them [20261122c]
- Contractor HQ moves to **resources.mismo.org/contractor-hq/** (the repository is renamed contractor-hq). Every email button, the review link, the Expenses phone app and Help use the new address; the old one forwards to the same page at the new one, so links already sent keep working. Sign-ins, keys and data are unchanged [20261122b]
- The portal is now called **Contractor HQ** (it was Service Orders and Agreements): the page title, the header, the sign-in card, the emails' buttons (Open Contractor HQ) and the printed expense report. Its address, sign-ins and everything in it are unchanged; Service Orders stays the name of the orders page inside it [20261122a]
- Recording the certifications on an invoice now also corrects its stored figures (What MISMO Had Approved and the Difference), so the firm's screen no longer says it does not match. Falcon's MISMO1026 was corrected to $4,000.00 approved, no difference [20261122a]

## 2026-11-18

- Assessor invoices record every certification they bill, for the Certification Management System's Assessor Invoice column on Certification Completions: MISMO can tick the certifications on any invoice from a firm paid per review (from the PDF, any state, with the fee), and an invoice that charges more than its hours with none recorded cannot be approved until they are. Falcon's MISMO1026 was back-filled: NotaryHub RON Renewal 3 and Rocket Close RON Renewal 6 [20261118a]

## 2026-11-17

- Expenses follow MBA's updated meal guidance: $25 breakfast, $40 lunch, $60 dinner, $15 snacks, no more than $140 of meals per person per day; anything over $15 now needs a receipt (meals and everything else, mileage aside), and without one no more than $15 can be claimed [20261117b]
- MISMO Only notes and Help give the full Q Drive location of the Service Orders Archive: MISMO › Active Documents › Contracts › Consulting Agreements › Service Orders Archive [20261117a]

## 2026-11-16

- Service Orders is one page: Revise an Order, End a Service Order and the order half of Executed Documents are gone. Every order, this year and past years, with search (title, company, facilitator, kind), filters (company, fiscal year opening on this year, status), grouped by company with a count and the total; open an order to revise it (not executed), end it (executed) or read it (past). Executed Documents is now Agreements, with earlier agreements underneath [20261116c]
- Past years from Smartsheet (everything before FY 2027): each company's own records and signed copies, read only, under My Service Orders › Past Years and My Agreements; email approvals and the former companies are MISMO only, with their place on the Q Drive [20261116c]
- New Service Order: no doubled words where a title's pieces meet ("Architecture Workgroup" + "Workgroup Facilitation" no longer gives "Workgroup Workgroup") [20261116c]
- New Service Order: Delivery and Payment Schedules can be marked Not applicable to this order; neither prints on the order or shows on the review page, and the order shows its rate, hours and maximum fee instead [20261116b]
- My Hours: an order's "Discard" button is now "Close Without Saving" (it only ever closed the row), and a new Clear This Row button empties a row logged by mistake; Help says how to clear a row logged in the wrong week [20261116a]

## 2026-11-09

- Split months the Smartsheet way: from November 2026 no week crosses a month end. A month ending Monday to Thursday gets its own short week ending on its last day (first one: w/e 11/30/26), and a month-end weekend stays with its Friday week (w/e 10/30/26 runs to Saturday 10/31). The week ending 11/6/26 starts November 1 and no longer asks how many hours were in October [20261109a]

## 2026-11-08

- Help for staff, the VP and the President now matches how orders move: review first, back to Jonna, the VP's release sends it to the company, reminders, Brian, and the automatic Accounts Payable email; it covers templates, drafts, Add Another and the Statement of Activities line [20261108a]
- Publishing: a change is saved as a version in `releases/<version>/`, tried first as the Test Copy (resources.mismo.org/service-orders/releases/&lt;version&gt;/), and made live by Jonna with Actions › Publish a Version, which runs every check first; running it with an earlier version rolls back. No more uploading index.html by hand [20261108a]
- Automatic checks on every upload: scripts parse, no keys or tokens, saving is set right, every page has its safety list, the version is stamped, and browser checks of the whole order, review, drafts, sign-in, invoice and phone-app paths on made-up companies [20261108a]
- Each page has a safety list (Content-Security-Policy) naming the only places it may load code from or send data to: the save relay, Google Fonts, and the receipt reader's files [20261108a]
- Help ends with the version you are on; the Test Copy shows a tag in the header saying it is the Test Copy and that its saves are real [20261108a]
- How-it-works guide for whoever works on Service Orders next (DEVELOPING.md), and this change log

## 2026-11-07

- Approving an invoice or expense invoice emails MBA Accounts Payable "Invoice to Process" with the invoice PDF attached and Jonna copied, in the same words as MISMO Money's Email to Accounting
- New service orders name the Statement of Activities line they are paid from (required), so MISMO Money can put their invoices on that line

## 2026-11-06

- New Service Order drafts: Save as Draft, Your Drafts, open one again, delete, and send the chosen drafts together
- A requester's review comes back to Jonna in Needs You before anything goes to the VP; she sends one or all approved orders on; Raise This Order is now Send for Review; several new orders can be sent together, with one email per reviewer
- The VP's approval sends the order to the contracting company with Jonna copied; three weekly reminders follow, then a "still not accepted" email to Jonna; acceptance tells the President with Jonna copied and stops the reminders
- Anything left in [brackets] must be filled in by the requester; such an order cannot be approved as it is or sent straight to the VP
- Saved templates: save any order as a template; a Summit Workshop Facilitation template
- New Service Order starts from a template (DWG, CoP and every other kind of order on file), filling in the services, deliverables, rate and usual hours; the requester can change the details on the review page and send them back
- The Expenses phone app stays signed in for eight hours after it is closed, like Team HQ; Sign Out works in the app
- Sign-in: one wrong password counts once, not once per company key (people were being locked out after one or two tries); a locked account is told how to unlock it

## 2026-11-05

- Opening My Expenses on a phone opens the Expenses app (the iPhone fix Team HQ has)
- Review picker: staff with no email saved in Team HQ get their first initial and surname @mismo.org
- Contractor expenses the Team HQ way: receipts emailed to expense@mismo.org land in the contractor's own My Expenses, they submit all at once as an expense report, print it for their company, and the company sends a matching expense invoice
- Staff review for new service orders: the person who asked for an order reviews it on its own page before it goes on
- Saves merge into the newest copy instead of overwriting a teammate's changes

## 2026-11-04

- A review Actualize had already invoiced (June 2026) stays off its invoices

## 2026-11-02

- Hours Remaining: allotted, used and remaining hours for every service order, by company, facilitator and month

## 2026-11-01

- The Expenses phone app (install to the home screen) and the receipt reader that fills in the date, amount and place

## 2026-10-28

- Certification reviews on invoices: per-review billing for the firms that are paid per review, read from the Certification Management System; reviews already invoiced in MACTS stay off
- The hours table total shows hours only; reviews have their own total
- Reviews-only companies: an old period is not shown as overdue

## 2026-10-24 to 2026-10-25

- A sixth company was added to the portal's sign-in settings; it was taken out again in the October 28 upload, and the portal has five companies

## 2026-10-08

- The MISMO logo leads home and grows on hover, as on every other tool

## Early October 2026

- The portal moves to resources.mismo.org/service-orders/ on the save relay: service orders, e-signing by the company and the President, the VP's decisions, hours, invoices, MSA extension letters and executed documents
