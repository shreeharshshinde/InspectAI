from transformers import AutoTokenizer, AutoModelForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset
import pandas as pd

model_name = "microsoft/codebert-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)

df = pd.read_csv("data/processed/train_dataset.csv")
dataset = load_dataset("csv", data_files="data/processed/train_dataset.csv")

def tokenize(batch):
    return tokenizer(batch["diff_added"], truncation=True, padding="max_length", max_length=256)

tokenized = dataset.map(tokenize, batched=True)
model = AutoModelForSequenceClassification.from_pretrained(model_name, num_labels=4)

args = TrainingArguments(
    output_dir="models/codebert_finetuned",
    evaluation_strategy="steps",
    per_device_train_batch_size=8,
    num_train_epochs=3,
    save_steps=1000,
    save_total_limit=2,
)

trainer = Trainer(model=model, args=args, train_dataset=tokenized["train"])
trainer.train()
