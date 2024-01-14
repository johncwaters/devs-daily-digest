import Parser from "rss-parser";
import { keywords } from "./keywordList";

export interface FetchedArticle {
	title: string;
	link: string;
	content: string;
	publishedDate: string;
	author: string;
	source: string;
	subject: string;
}

export async function fetchRss(url: string): Promise<FetchedArticle[]> {
	try {
		const parser = new Parser({
			timeout: 1000,
		});

		const feed = await parser.parseURL(url);

		// get rid of https and anything after .com or .org
		const readableSource = url
			.replace("https://", "")
			.replace("http://", "")
			.split(".")[1];

		// Grab the articles from the feed
		const articles: FetchedArticle[] = feed.items.map(
			({ title, link, content, pubDate, creator }) => ({
				title: title || "",
				link: link || "",
				content: content || "",
				publishedDate: pubDate || "",
				author: creator || "",
				source: readableSource,
				subject: "",
			}),
		);

		// Only return articles from the past few days
		const daysAgo = 4;
		const now = new Date();
		const cutoff = new Date(now.setDate(now.getDate() - daysAgo));
		const filteredArticles = articles.filter(
			({ publishedDate }) => new Date(publishedDate) > cutoff,
		);

		// Format the date to be more readable
		for (const article of filteredArticles) {
			article.publishedDate = new Date(
				article.publishedDate,
			).toLocaleDateString();
		}

		// Apply a subject to each article from Development, UX, Design, Productivity based on keywords found in the title and body
		// Otherwise, put subject as 'Other'
		for (const article of filteredArticles) {
			for (const [subject, subjectKeywords] of Object.entries(keywords)) {
				for (const keyword of subjectKeywords) {
					const regex = new RegExp(`\\b${keyword}\\b`, "i");
					if (
						regex.test(article.title.toLowerCase()) ||
						regex.test(article.content.toLowerCase())
					) {
						article.subject = subject;
						break;
					}
				}
			}
			if (!article.subject) {
				article.subject = "Other";
			}
		}

		// Clean up the article body and author
		for (const article of filteredArticles) {
			// Clean up body text by removing html tags
			article.content = article.content.replace(/<[^>]*>?/gm, "");
			// Remove any emails from article author like test@test.com
			article.author = article.author.replace(/\S+@\S+\.\S+/g, "");
			// Remove any parentheses from article author like (test) but leave the words inside
			article.author = article.author.replace(/[()]/g, "");
		}

		// Cap the length of article body to 200 characters
		// Only cap the length to the end of a word
		const maxBodyLength = 180;
		for (const article of filteredArticles) {
			if (article.content.length > maxBodyLength) {
				article.content = article.content.substring(
					0,
					article.content.lastIndexOf(" ", maxBodyLength),
				);
				article.content += "...";
			}
		}

		return filteredArticles;
	} catch (error) {
		console.error("Error fetching RSS feed for:", `${url} ${error}`);
		return [];
	}
}
