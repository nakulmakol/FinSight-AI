from pathlib import Path

import chromadb
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from app.config import DATA_DIR, get_settings


class VectorStoreService:
    def __init__(self) -> None:
        settings = get_settings()

        self.persist_dir = settings.chroma_persist_dir

        self.embedding_fn = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )

        self.client = chromadb.PersistentClient(
            path=self.persist_dir
        )

        self.collection_name = "finsight_regulatory_docs"

        self.splitter = RecursiveCharacterTextSplitter(
            chunk_size=900,
            chunk_overlap=120,
            separators=["\n\n", "\n", ". ", " ", ""],
        )

        self._store: Chroma | None = None

    def _get_store(self) -> Chroma:
        if self._store is None:
            self._store = Chroma(
                client=self.client,
                collection_name=self.collection_name,
                embedding_function=self.embedding_fn,
            )
        return self._store

    def ingest_text(
        self,
        text: str,
        metadata: dict,
    ) -> int:

        docs = self.splitter.create_documents(
            [text],
            metadatas=[metadata],
        )

        print(f"Adding {len(docs)} chunks...")

        store = self._get_store()

        store.add_documents(docs)

        print("Done.")

        return len(docs)

    def ingest_directory(
        self,
        directory: Path,
    ) -> int:

        total = 0

        if not directory.exists():
            print("Directory does not exist:", directory)
            return 0

        print("=" * 60)
        print("Scanning directory:", directory)
        print("=" * 60)

        for path in sorted(directory.glob("**/*")):

            if path.is_dir():
                continue

            if path.suffix.lower() not in {".txt", ".md"}:
                continue

            print(f"\nReading file: {path}")

            try:

                text = path.read_text(
                    encoding="utf-8"
                )

                metadata = {
                    "source": path.name,
                    "title": path.stem.replace("_", " ").title(),
                    "path": str(path),
                }

                chunks = self.ingest_text(
                    text,
                    metadata,
                )

                print(
                    f"{path.name} -> {chunks} chunks added."
                )

                total += chunks

            except Exception as e:

                print("FAILED:", path)
                print(type(e).__name__)
                print(e)

        print("=" * 60)
        print("TOTAL CHUNKS:", total)
        print("=" * 60)

        return total

    def search(
        self,
        query: str,
        k: int = 4,
    ) -> list[Document]:

        store = self._get_store()

        return store.similarity_search_with_score(
            query,
            k=k,
        )

    def document_count(self) -> int:

        try:

            count = self.client.get_collection(
                self.collection_name
            ).count()

            print(
                f"Existing Chroma documents: {count}"
            )

            return count

        except Exception as e:

            print("Collection not found.")
            print(e)

            return 0


vector_store = VectorStoreService()


def bootstrap_documents() -> int:

    docs_dir = DATA_DIR / "documents"

    print("\n")
    print("=" * 70)
    print("BOOTSTRAPPING VECTOR DATABASE")
    print("=" * 70)

    print("DATA_DIR :", DATA_DIR)
    print("DOCS_DIR :", docs_dir)
    print("Exists   :", docs_dir.exists())

    if docs_dir.exists():
        print("\nFiles found:")

        for file in docs_dir.glob("*"):
            print(" -", file.name)

    existing = vector_store.document_count()

    if existing > 0:
        print(
            f"\nVector DB already contains {existing} documents."
        )
        return existing

    print("\nStarting ingestion...\n")

    count = vector_store.ingest_directory(
        docs_dir
    )

    print("\nFinished ingestion.")

    print("Chunks added:", count)

    return count