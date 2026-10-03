# Project Coding Rules & Engineering Standards

## India Smart Tools

These 36 rules are non-negotiable standards for all current and future engineering work on the India Smart Tools platform. Every pull request, file edit, and feature addition must adhere to these principles.

---

### Section 1: Security, Secrets & Credentials

1. **Never expose API keys**: Client-side bundles must never include private API keys or access tokens.
2. **Never hardcode secrets**: All environment-specific variables must reside in environment configurations (`.env`), never in source code.
3. **Do not commit .env files or secrets**: Ensure `.gitignore` explicitly prevents `.env`, credentials, or key files from entering version control.
4. **Do not claim a website is "100% unhackable"**: Never make unscientific security claims or guarantees in marketing copy or documentation.
5. **Use HTTPS in production**: All production communications must strictly enforce Transport Layer Security (TLS/HTTPS).
6. **Use secure headers where supported**: Configure Content-Security-Policy (CSP), X-Frame-Options, X-Content-Type-Options, and Referrer-Policy on all web server responses.

---

### Section 2: Input Validation & Content Sanitization

7. **Validate all user input**: Every form, text field, numeric input, and parameter must be validated before processing.
8. **Never trust client-side validation alone**: Client validation provides instant UX feedback; server-side or API endpoints must independently validate and authorize every incoming payload.
9. **Sanitize user-controlled content**: Prevent cross-site scripting (XSS) and injection attacks by escaping all user inputs before rendering into the DOM or passing to downstream functions.
10. **Validate uploaded files**: Verify uploaded files before processing.
11. **Restrict upload size**: Enforce strict file size limits (e.g. 5 MB - 25 MB max) to prevent memory exhaustion and denial-of-service.
12. **Validate file type and content where applicable**: Check file MIME types and inspect file header magic bytes; never rely on filename strings alone.
13. **Do not trust file extensions alone**: Attackers can rename `.exe` or script files to `.jpg` or `.pdf`. Verify actual format signatures.

---

### Section 3: Error Handling & Information Disclosure

14. **Never expose sensitive server errors**: Display clear, friendly, actionable messages to users rather than internal system errors.
15. **Never expose stack traces in production**: Stack traces reveal internal directory structures, library versions, and vulnerabilities. Error boundaries must display polite fallbacks.
16. **Remove debug logs from production**: Prohibit noisy `console.log` statements in production code.
17. **Handle API failures safely**: Wrap all network calls in resilient error handling with retries, graceful fallbacks, and user feedback.

---

### Section 4: Authentication, Authorization & Future APIs

18. **Do not store passwords in plain text**: When authentication is introduced, use industry-standard hashing (bcrypt/argon2) or delegated identity providers (OAuth).
19. **Use secure authentication practices**: Enforce HTTP-only, secure, same-site cookies or short-lived bearer tokens.
20. **Protect admin routes**: Restrict administrative views behind server-side verified role-based access control (RBAC).
21. **Check authorization server-side**: Client-side UI hiding is not security; every protected action must verify user permissions on the server.
22. **Use rate limiting for sensitive APIs**: Implement IP and account-based rate limiting on calculation endpoints, feedback forms, and login attempts.
23. **Protect payment endpoints and webhooks**: When monetization is introduced, verify cryptographic signatures on payment webhooks (e.g. Razorpay/Stripe).

---

### Section 5: Architecture, Modularity & Code Quality

24. **Avoid unnecessary dependencies**: Never install large external packages when a native browser API or small utility suffices.
25. **Keep components reusable**: Build modular components with well-defined TypeScript interfaces and single responsibilities.
26. **Do not duplicate logic unnecessarily**: Centralize calculations, mathematical formulas, and formatting functions in shared utility modules.
27. **Preserve existing functionality when adding features**: New features must never break or regress existing working tools or pages.
28. **Do not redesign existing UI unless requested**: Maintain the established design system, color palette, and layout hierarchy across development iterations.
29. **Keep dependencies updated**: Regularly audit packages for security advisories and deprecations.

---

### Section 6: Truth in UI & Anti-Slop Discipline

30. **Do not create fake functionality**: Never build buttons, sliders, or forms that appear functional but perform no action or display mock success.
31. **Do not use fake testimonials, statistics, or company information**: Only display verified user feedback, real metrics, and factual company details.
32. **Use proper loading, error, and empty states**: Every asynchronous view or filtered list must provide explicit loading skeletons, error indicators, and empty-state messaging.

---

### Section 7: Accessibility, SEO & Device Testing

33. **Maintain accessibility (a11y)**: Follow WCAG 2.1 AA guidelines. Use semantic HTML elements, visible focus indicators (`focus-visible:ring-2`), and accessible labels.
34. **Maintain SEO requirements**: Update document title, meta descriptions, canonical URLs, and Open Graph tags dynamically on every route.
35. **Test mobile layouts**: Verify responsive layouts on small mobile phones (360px width), tablets, and desktop displays. Ensure touch targets are >= 44px.
36. **Test slow network conditions**: Test platform usability under throttled 3G/4G network simulations. Ensure critical tools render instantly.
