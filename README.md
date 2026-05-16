# Variables.md

## Motivation

I'm using Obsidian to write a pentest handbook that have series of commands that I can issue against a target. Below is an example of such commands.

```
sudo nmap -sV -sC -Pn -p- 192.168.1.1
```

There's many commands that use the same IP address and when my target changes, I would like to be able to change all addresses dynamically. As a result I would like to create a plugin that implements a new Markdown element: variables.

## Variables Specification

A variable is defined in the frontmatter of an Obsidian note, in the form of a property.

```
---
ip: 192.168.1.1
---
```

To use the variable, we simply enclose the variable name in double curly braces.

```
nmap {{ip}}
```

Obsidian should render it as

```
nmap 192.168.1.1
```
