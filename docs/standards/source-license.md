# Source & License Policy

This file documents engineering policy, not legal advice.

## Core distinction

> “Visible on the internet” is not the same as “may be copied and redistributed inside a component catalog.”

## Status

### Copy OK
Use when the relevant implementation is under a clear permissive license (MIT, Apache-2.0, BSD, ISC, CC0 where appropriate) or is a Hub-original implementation.

Requirements:
- retain required copyright/license notices
- check bundled dependencies
- do not assume fonts/images/brand assets share the code license

### Reference
Use when the source is useful for vocabulary/inspiration but:
- has a custom license
- uses Commons Clause or competing-product restrictions
- is a marketplace/aggregator
- has unclear screenshot/content reuse rights
- has a clear end-product license but forbids source-library redistribution

In this status, prefer a Hub-original generic demo plus original link, not copied source.

### Restricted
Do not ingest source code or proprietary preview assets into the Hub.

## Evidence order

When signals conflict, trust them in this order:

1. Repository LICENSE / official legal terms
2. Official product license page
3. Package metadata
4. README marketing language
5. Third-party article/search snippet

A README saying “MIT” does not override an actual LICENSE containing additional restrictions.

## Screenshots

A permissive code license does not automatically grant permission to mirror:
- product screenshots
- photography
- illustrations
- videos
- brand marks
- web fonts

When preview rights are uncertain, render a Hub-original live demo and link to the source.

## Brand-derived DESIGN.md

A design analysis may be licensed separately from the source brand. Preserve source attribution and avoid presenting a brand-derived reference as official unless it is first-party.
