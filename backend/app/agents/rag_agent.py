from app.models.schemas import AgentTrace, Citation
from app.rag.vectorstore import vector_store


class RAGAgent:
    role = "RAG Agent"
    goal = "Retrieve regulatory and market documents from the vector store"

    def run(self, query: str) -> tuple[list[Citation], AgentTrace]:
        results = vector_store.search(query, k=4)
        citations: list[Citation] = []
        for doc, score in results:
            meta = doc.metadata or {}
            citations.append(
                Citation(
                    source=meta.get("source", "unknown"),
                    title=meta.get("title", "Regulatory Document"),
                    excerpt=doc.page_content[:420].strip(),
                    relevance=round(max(0.0, 1.0 - float(score)), 3),
                )
            )
        summary = (
            f"Retrieved {len(citations)} relevant document chunks from Chroma vector store."
            if citations
            else "No matching documents found in vector store."
        )
        return citations, AgentTrace(agent=self.role, status="completed", summary=summary)
