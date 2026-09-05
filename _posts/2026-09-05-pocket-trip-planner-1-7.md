---
layout: post
title: "Pocket Trip Planner 1.7 — the Mac app catches up"
date: 2026-09-05
app_slug: pockettripplanner
image: /img/blog/pockettripplanner/pockettripplanner_mac1.jpg
tags: [ios, mac, macos, travel, swiftui, side-project]
excerpt: "Version 1.7 turns Mac support from 'it launches' into a real Mac app — menu bar commands, keyboard shortcuts, right-click menus, and drag-and-drop, all built on the same SwiftUI code as iPhone and iPad."
screenshots:
  - src: /img/blog/pockettripplanner/pockettripplanner_mac1.jpg
    alt: "Pocket Trip Planner running on Mac with sidebar navigation"
    caption: "The same trip planner, now built for a mouse and keyboard"
  - src: /img/blog/pockettripplanner/pockettripplanner_mac2.jpg
    alt: "Mac menu bar with New Trip, Find, and Settings commands"
    caption: "Real menu bar commands — ⌘N, ⌘F, ⌘,"
  - src: /img/blog/pockettripplanner/pockettripplanner_mac3.jpg
    alt: "Right-click context menu on a trip budget row"
    caption: "Right-click anywhere you could swipe on iPhone"
  - src: /img/blog/pockettripplanner/pockettripplanner_mac4.jpg
    alt: "Dragging a PDF confirmation into Trip Files on Mac"
    caption: "Drag a confirmation PDF straight in from Finder"
---

I'll be honest about something: Pocket Trip Planner has technically run on Mac for a while now. "Technically" is doing a lot of work in that sentence. It launched, the trip list showed up, you could tap around with a mouse pretending it was a finger — and that was about it. No keyboard shortcuts. No right-click. Hit Return in a text field and nothing would happen, because nothing was listening for it. It was an iPhone app that happened to open on a Mac, not a Mac app.

1.7 is the release where I stopped letting that slide.

## What I wanted

The pitch for Pocket Trip Planner hasn't changed: one place for your itinerary, packing lists, budget, important dates, and notes for a trip, without an account, without ads, and without your itinerary getting parsed on someone else's server. Everything runs on-device, and Pro is a one-time unlock, not a subscription.

What I wanted for 1.7 was for the Mac version to actually feel like it belonged on a Mac. Same SwiftUI codebase as iPhone and iPad — I'm not maintaining a separate Mac app — but built to expect a keyboard, a mouse, and a window you can resize, instead of assuming every tap is a finger and every list only ever gets swiped.

## Why I built it

I've been a software engineer since 2012, and Pocket Trip Planner is very much a nights-and-weekends project — built in the margins between a day job and a family, one trip's worth of frustration at a time. I plan our vacations in it, so most of what changes in this app started as something that annoyed me personally on an actual trip. The Mac work was no different: I opened the Mac build to plan a trip, reached for a keyboard shortcut that didn't exist, and started a list.

## Version 1.7

### A real menu bar

There's now an actual menu bar, not just the default Edit/View boilerplate macOS gives you for free. **⌘N** starts a new trip, **⌘F** jumps straight to Find Trips & Plans, and **⌘,** opens Settings — the shortcuts you'd expect from any Mac app. The Help menu points to the in-app guide and About screen instead of sitting empty.

### Right-click, everywhere you'd expect it

Every list in the app that had a swipe action on iPhone — budget entries, transactions, transportation legs, packing items, imported events — now has the matching right-click menu on Mac. Rows also reveal their actions on hover, so you're not left guessing that a menu exists at all. None of this is new functionality, exactly; it's the functionality that was already there, finally reachable without a touchscreen.

### Drag and drop for Trip Files

Trip Files — the per-trip vault for confirmations, boarding passes, and screenshots — now accepts a drag straight from Finder instead of forcing you through a file picker every time. While I was in there I also found and fixed a genuinely annoying bug: a PDF downloaded from Safari would silently fail to import. Turned out macOS tags downloaded files with a quarantine attribute, and the app was choking on it during the copy. Fixed now, and it also opened the door to accepting images alongside PDFs.

### The small stuff that adds up

The rest of 1.7 is a pile of things that were each small on their own but, together, were the difference between "runs on Mac" and "works on Mac":

- Escape and Return now actually do something in every add/edit sheet in the app — trips, packing items, important dates, transportation, events. Previously they were just decorative buttons you had to click.
- The Pro upgrade screen used to render tiny and unscrollable on Mac, cutting off half the feature list. It's been resized and laid out properly for a wider window.
- Typing a budget amount and hitting Return used to do nothing — you had to reach for the mouse and click Add. It submits now, like it should have from the start.
- Restore Purchases is more reliable. There was a bug where the app could read an empty purchase history right after launch and assume Pro had been revoked, which was especially visible on Mac where a fresh restore is more common.
- The home screen widget actually refreshes when your trip data changes, instead of sitting stale until the OS got around to it on its own schedule.

None of this required a separate Mac codebase or a bunch of `#if os(macOS)` branches scattered everywhere — almost all of it is the same SwiftUI views iPhone and iPad already use, just given the extra affordances a mouse and keyboard expect. That was the whole point.

## Try it

Pocket Trip Planner is free to download, with Pro as an optional one-time unlock — no subscription, no account required. It now runs natively on iPhone, iPad, Mac, and Apple Vision Pro.

- [Download on the App Store](https://apps.apple.com/us/app/pocket-trip-planner/id6741714565)
- [Pocket Trip Planner — product page](https://mitchell525.github.io/pockettripplanner/)

The screenshots below show the rest of the story better than I can in words.
