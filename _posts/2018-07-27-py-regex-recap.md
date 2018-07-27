---
layout: post
title: So I Thought I Knew Regex
premalink: /articles/py-regex-recap/
---

<p align="center">
<img src="/images/regex.jpg">
</p>

**TL;DR:** _Having been working with text for so many years, I thought I could call myself a regular expression veteran. I can do quite a few fancy things with merely regex in TextPad. However, my recent text mining project made me realize that I need to do some systematic review on regex in Python. In this article, I will walk through some key points about Python regex through a number of road blockers I encountered during my project._

Although the grand theme applies to most situations, there are so many nuances about regex when it comes to different platforms. The syntax can be very different between regex in a text editor and a programming language. Looking at Python's regex specifically, there is also how regex functionality was structured as modules and objects.

### Confusion 1
####re.compile(<pattern>) or re.search(<pattern>, <string>)
When I first started working on my text mining project, I was too lazy to read through the python documentation about regex. And indeed most of the time stackoverflow will give pretty decent solutions for me to get by (I do follow the ten-tab role at the very least though!). But:
To start using Python regex, some people do this:
```
pattern = re.compile('-\d{2}-', re.IGNORECASE)
match = pattern.search('the number: bc-22-a0')
```
while others do this:
```
match = re.search('-\d{2}-', 'the number: bc-22-a0',re.IGNORECASE)
```
I admit that I have used both for completing identical tasks. And it always bugged me that I was not certain about whether one is better than the other or what. So this is the first thing I turned to the Python documentation for clarification:
> It is important to note that most regular expression operations are available as module-level functions and methods on compiled regular expressions. The functions are shortcuts that don’t require you to compile a regex object first, but miss some fine-tuning parameters.

So now I get it: the first approach listed above relies on the compiled regex object, aka a regex object is created with the pattern first, then the object calls certain function to look for matching strings. The second approach on the other hand skipped the object creation. It used the module to call match functions directly. Recall that `re` is the module name. This behavior is the same as Python's `matplotlib` module. One can either create a `figure` object and use it to call plot functions or use `matplotlib.pyplot` module to call plot functions directly. See details [here](https://matplotlib.org/api/pyplot_summary.htmlm).

### Confusion 2
####r'\w{2}\d{3}' vs '\w{2}\d{3}'
Similar to the above approaches, I have seen people using both in their regex code. See according to the documentation:
>...The solution is to use Python’s raw string notation for regular expression patterns; backslashes are not handled in any special way in a string literal prefixed with 'r'. So r"\\n" is a two-character string containing '\\' and 'n', while "\\n" is a one-character string containing a newline. Usually patterns will be expressed in Python code using this raw string notation.

I personally think that this statement is a bit confusing. Basically it is saying that if you mark your string literal as a raw string literal (using r') then the python interpreter will not change the representation of that string before putting it into memory. **But once they've been parsed they are stored exactly the same way. This means that in memory there is no such thing as a raw string. Both the following strings are stored identically in memory with no concept of whether they were raw or not.**
`r'\d'` and `'\\d'` will be treated the same pattern (a digit character) by re.func(). `r'\d'` does not mean that re.func() will see one backslash and one letter "d".

In summary, in many situations, `r'...'` and `'...'` means the same pattern. One needs to understand how exactly these two ways work differently to pick the right one for a specific situation.

### Confusion 3
#### search/match/findall
When we set up our pattern, the next step is to use the pattern onto the string in question to see if there is a match/matches. I have seen `re.search()`, `re.match()` and `re.findall()` for this task. So what is the difference?

Here is what I found based on experimenting:
1. re.search():
```
match = re.search(<pattern>, <string>)
match = re.search('(\d{2})[^\d]\*(\d{2})', 'this is 222, 33, 6.')
```
_search() only returns the first match, as oppose to all matches as findall()'s behavior.
search returns a Match object which has a bunch of attributes and functions. Often we can keep and  get the matched content via grouping_

2. re.match():
```
match = re.match(<pattern>, <string>)
match1 = re.match('(\d{2})[^\d]\*(\d{2})', 'this is 222, 33, 6.')
print match1
>> None
match2 = re.match('^.\*(\d{2})[^\d]\*(\d{2})', 'this is 222, 33, 6.')
print match2
>> 'this is 222, 33'
```
_match1 returns None because match() has to find something from the very
beginning of the string
match2 returns a match object because it finds something from the very
beginning match2.group(0)
this behavior is different from the match object generated by search()_

3. re.findall()
```
re.findall(<pattern>, <string>)
re.findall('\d{2},', '22, 345, 45, 2, 98')
>> ['22,', '45,', '45,']
```
_if no grouping, returns all matches as a string list
if grouped, returns all groups as a string list
findall() will find all existing matches, unlike search() which stops after
finding the first match_

### Confusion 4
#### Other fancy syntax

1. nested repetition:
Python does not allow direct nesting for repetition qualifiers like * or + or {m,n}. Instead, parentheses need to be used:
(?:a{6})* matches any multiple of six 'a' characters

2. Greedy qualifiers:

 '\*', '+' and '?' are all greedy. Meaning that they match as much text as possible.
example:
pattern '<.\*>' on string '\<a\> b \<c\>' will treat the entire string as ONE match
```
re.findall('<.\*>','<a>b<c>')
>> '<a>b<c>'
```
'?' can be added after the greedy qualifiers to make it non-greedy
```
re.findall('<.\*?>','<a>b<c>')
>> ['<a>', '<c>']
```

3. {m,n}:

 Omitting m specifies a lower bound of zero, and omitting n specifies an
infinite upper bound.
`{,n}`
`{m,}`
Adding '?' after will match as few repetitions as possible:
on the 6-character string 'aaaaaa', `a{3,5}` will match 5 'a' characters,
while `a{3,5}?` will only match 3 characters.

4. (?...):

 According to the documentation:

>This is an extension notation (a '?' following a '(' is not meaningful otherwise). The first character after the '?' determines what the meaning and further syntax of the construct is.

    4.1 (?:...)

 non-capturing version of parentheses (means it won't be treated as a group)
This can be useful for:
* nested repetition:
`(?:a{6})*`
* OR pattern
`(?:january|feburary|march)`

 4.2 (?=...)

 if ... matches next
`Isaac (?=Asimov)` will match 'Isaac ' only if it’s followed by 'Asimov'.
```
re.findall('Isaac ?(?=Asimov)','Isaac Asimov')
>> ['Isaac ']
```
 4.3 (?!...)

 if ... doesn't match next
`Isaac (?!Asimov)` will match 'Isaac ' only if it’s not followed by 'Asimov'.

```
re.findall('Isaac ?(?!Asimov)','Isaac something')
>> ['Isaac ']
```
 4.4 (?<=...)

 if ... matches the preceded string
```
re.findall('(?<=abc)def', 'abcdef')
>> ['def']
```
 4.5 (?<!...)

 if ... doesn't match the preceded string
```
re.findall(r'(?<!-) \w+', 'spam egg')
>> [' egg']
```

5. \b

 matches the beginning or end of a word. This is particularly useful when you want to look for words
```
re.findall(r'\bfoo\b', 'foo bar')
>> ['foo']
```

That's it. I hope this can be helpful for someone who struggles with Python regex like I did!
