---
name: saa-exam-prep-verifier
description: "Verify a piece of AWS knowledge and check whether the SAA exam-prep blog posts already cover it. Use this whenever the user drops in an SAA practice question (with or without answer choices), a fact or scenario they read on a technical blog, a claim about an AWS service, or asks things like 'is this in my exam prep posts', 'do my posts cover this for the SAA', 'kiểm tra kiến thức này đã có trong bài chưa', 'cái này thi SAA có cần không', 'verify giúp tôi thông tin này' — anytime the goal is to confirm a fact is correct AND find out if the 'Exam Prep' tagged posts have enough on it to pass the AWS Solutions Architect Associate exam. Trigger even when the user just pastes a question or an AWS factoid without spelling out that they want a coverage check."
---

# SAA Exam Prep Verifier

The user is curating a set of blog posts (tagged `Exam Prep`) that together should contain everything needed to pass the AWS Solutions Architect Associate (SAA-C03) exam. As they study, they run into knowledge in the wild — a practice question, a claim on a technical blog, a service behavior — and they want two things answered:

1. **Is it actually true?** Practice questions and blog posts are often wrong, outdated, or stating a trap. A fact that is subtly wrong is worse than useless, so verify before anything else.
2. **Is it already covered?** If the correct knowledge is missing from the exam-prep posts, that is a gap to close. The whole point is to make those posts complete enough to pass the exam.

Your job is to produce a clear verdict on both, and pinpoint exactly where any gap lives so the user can decide what to add. This is a **read-only analysis** — you do not edit posts. (If the user then wants to write the missing material, that is the `blog-writer` skill's job, and remember Vietnamese is written first, then English — see `CLAUDE.md`.)

## The corpus: two tiers

Knowledge for this exam is spread across two groups of posts. Always work with both, because where a fact lives changes the recommendation.

- **PRIMARY — tag `Exam Prep`**: the exam-prep map the user is actively building. If a correct, exam-relevant fact belongs here but is absent or only half-explained, that is a real gap.
- **SECONDARY — tag `SAA` (but not `Exam Prep`)**: deep-dive posts that already hold a lot of exam-relevant knowledge (DynamoDB, Aurora, EC2 purchasing options, SQS, S3 storage classes, and so on). If a fact is covered only here, it is **not missing from the blog** — it is just not in the Exam Prep map yet. Say so precisely; "add a cross-reference" is a very different action from "write this from scratch."

Posts exist in both `content/vi/posts/` and `content/en/posts/` with the same slug. **Vietnamese is the source of truth** (it is written first). When you cite where something should be added, point at the Vietnamese file.

## Step 1 — Map the corpus

Run the bundled script to get the current, authoritative list of posts in each tier with their titles and descriptions. Do not hardcode the post list from memory — posts get added, and the script reflects reality:

```bash
python3 .claude/skills/saa-exam-prep-verifier/scripts/list_exam_posts.py
```

The descriptions are rich — they usually enumerate the exact services/features a post covers. Use them to route each claim to its most likely home post before you start grepping.

## Step 2 — Decompose the input into atomic, checkable claims

The input is rarely a single fact. Break it into the smallest exam-relevant knowledge points, because accuracy and coverage differ per point. Tailor the decomposition to the input type:

- **A practice question (multiple choice)**: extract (a) the concept being tested, (b) the correct answer and the reasoning that makes it correct, and (c) the trap distractors — the wrong options that are tempting and *why* they are wrong. The traps are often the most valuable thing to capture, because that is what the exam actually tests. Treat each of these as a claim to verify and check coverage for.
- **A blog scenario or claim**: pull out each distinct factual assertion (a limit, a default, a "service X does Y", a "when to use A vs B").
- **A bare factoid**: it may already be atomic.

State each claim as one sentence you can independently rule true or false. Keep AWS service and feature names in English even though your report is in Vietnamese.

## Step 3 — Verify accuracy (this comes before coverage)

For each claim, judge whether it holds for the current SAA-C03 exam. Lean on your AWS knowledge, but **reach for the web when the claim is the kind that drifts or is easy to get wrong**, for example:

- Hard numbers and limits (max object size, default quotas, RPO/RTO figures, port numbers, timeout defaults).
- Recently changed or expanded behavior (a service that gained a feature, a default that flipped, a service that now does cross-Region what it once could not).
- "Only / always / never" style absolutes — these are exactly where exam traps and stale blog posts live.
- Anything where you feel even mild uncertainty. A confident wrong answer here defeats the purpose.

When you web-check, prefer official AWS sources (docs.aws.amazon.com, AWS service FAQs, the AWS Well-Architected and whitepaper pages). Cite the source in the report so the user can trust the verdict. Use `WebSearch`/`WebFetch` (load them via ToolSearch if they are not already available).

Assign one accuracy verdict per claim:

- **✅ Đúng** — correct as stated.
- **⚠️ Đúng nhưng có điều kiện** — true only under conditions the input glosses over; spell out the condition. This is the most common "trap" shape.
- **❌ Sai** — incorrect. Give the correction. If the input is a practice question whose marked answer is wrong, this is critical to flag.
- **🕓 Lỗi thời** — was true, AWS has since changed it. Give the current behavior and (if you web-checked) the source.

## Step 4 — Locate coverage

For each claim that is **correct** (or correct-with-a-caveat), find out whether the corpus explains it well enough to answer an exam question about it. "Mentioned once in passing" is not coverage — the exam tests understanding, so the bar is "a student reading only this post could answer the question."

Search both locales and both tiers. Practical approach:

1. Grep the distinctive terms (service name, feature name, the specific keyword) across `content/`:
   ```bash
   grep -rln -i "transfer acceleration" content/vi/posts content/en/posts
   ```
   Grep broadly first — a fact may live in a post you did not expect.
2. Open the matching post(s) and read the relevant section. Judge whether the *specific* claim/nuance is actually explained, not just whether the service is named.
3. If nothing matches, widen the search (synonyms, the parent service, the problem it solves) before concluding it is missing.

Assign one coverage verdict per claim:

- **✅ Đã có (Exam Prep)** — explained in a `Exam Prep` post. Cite `file:section`.
- **🟡 Có một phần** — the topic/post exists but this specific detail, nuance, or trap is not covered. Name what is missing.
- **🔵 Chỉ có ở bài SAA** — explained, but only in a `SAA` (non-Exam-Prep) post. Cite it. The action is usually "pull into the Exam Prep map or cross-link," not "write new."
- **❌ Chưa có** — not in the corpus at all. This is a true gap.

## Step 5 — Write the report

Report in **Vietnamese** (the user's working language); keep AWS terms in English. Use file links the user can click, formatted as the path relative to the repo root with an optional `:line` — e.g. `[aws-storage-extras-overview.mdx](content/vi/posts/aws-storage-extras-overview.mdx)`.

Use this structure:

```markdown
# Kiểm tra Exam Prep — <chủ đề ngắn gọn>

## Tóm tắt
Một câu kết luận: input đúng/sai ở đâu, và còn thiếu gì trong Exam Prep map.
Bảng nhanh: N điểm kiến thức — X đã có, Y một phần, Z chỉ ở bài SAA, W chưa có, và số claim sai/bẫy.

## Chi tiết từng điểm
### 1. <claim một câu>
- **Độ chính xác**: <✅/⚠️/❌/🕓> — <giải thích ngắn; correction nếu sai; nguồn AWS nếu đã tra web>
- **Coverage**: <✅/🟡/🔵/❌> — <bài + mục cụ thể, hoặc "chưa có">
- **Đề xuất**: <thêm vào bài nào, mục nào / cross-link / tạo bài mới / đã đủ>

(lặp lại cho từng điểm)

## Cần bổ sung để đủ thi (ưu tiên)
Danh sách gap đã sắp theo mức quan trọng cho kỳ thi. Mỗi dòng: nên thêm gì, vào bài VI nào.
Chỉ liệt kê điểm còn thiếu (🟡, 🔵, ❌) — bỏ qua những điểm đã đủ.
```

If everything checks out — input is correct and fully covered — say so plainly and keep it short; do not invent gaps to look busy. An honest "đã đủ, không cần bổ sung" is a valid and valuable result.

## Two failure modes to avoid

- **Confusing "the service is named" with "the exam point is covered."** A post can mention CloudFront ten times and still never explain that Transfer Acceleration rides the same edge network. Coverage is about the specific point, judged at exam depth.
- **Skipping the accuracy check and going straight to coverage.** If the input is a wrong practice answer, the most valuable thing you can do is catch it. Verify first; a gap analysis built on a false premise wastes the user's study time.
